var imgLoaded = false;

var radius = -1;
var radius_equ = -1;
var zf = 1;

var bigImg = false;

const computeParam = () => {
    form = new FormData(cam_param);
    const f = parseFloat(form.get("f_length"));
    const fov = parseFloat(form.get("fov"));
    const k = parseFloat(form.get("pix_elem_size"));
    const w = parseFloat(form.get("sensor_width"));
    const h = parseFloat(form.get("sensor_height"));
    // const zf = parseFloat(form.get("zoomFactor"));
    zf = zoomFactor.value;

    const N = Math.round(fov) + 1;

    const radians = (deg) => deg * Math.PI / 180.0;

    const phi = (n) => (- radians(fov) / 2.0) + (parseFloat(n) * radians(1));

    const ufe = (n) => phi(n) * f / k;
    const fau_equi = f / k;

    var A = math.ones(N, 2);
    A = math.multiply(A, -1.0);
    var b = math.zeros(N, 1);

    for(let i = 0; i<N; i ++)
    {
        p = phi(i);
        // console.log(p);
        A.set([i, 0], Math.sin(p) / ufe(i));
        b.set([i, 0], Math.cos(p));
    }
    pinvA = math.pinv(A);
    param = math.multiply(pinvA, b);
    fau = math.subset(param, math.index(0, 0));
    xi = math.subset(param, math.index(1, 0));
    residual_ = 0.0;
    for(let i = 0; i<N; i ++)
    {
        residual_ += Math.pow(((fau * Math.sin(phi(i))) / (Math.cos(phi(i)) + xi) - ufe(i)), 2);
    }
    residual_ = Math.sqrt(residual_) / parseFloat(N);

    f_au.innerHTML = (fau).toFixed(2) + (zf != 1 ? " (corrected: " + (fau * zf).toFixed(2) + " )" : "");
    f_au_equi.innerHTML = (fau_equi).toFixed(2) + (zf != 1 ? " (corrected: " + (fau_equi * zf).toFixed(2) + " )" : "");
    f_au_kb.innerHTML = (fau_equi).toFixed(2) + (zf != 1 ? " (corrected: " + (fau_equi * zf).toFixed(2) + " )" : "");
    Xi.innerHTML = xi;
    residual.innerHTML = residual_;

    const angle_max = radians(fov) / 2.0;
    const xlim = Math.cos(radians(90) - angle_max);
    const zlim = Math.sin(radians(90) - angle_max);
    radius = fau * xlim / (xi + zlim);

    radius_equ = fau_equi * angle_max;

    img_circ.innerHTML = (radius * 2.0).toFixed(2) + " px (" + (radius * 2.0 * k * 1000).toFixed(2) + " mm)";
    img_circ_equ.innerHTML = (radius_equ * 2.0).toFixed(2) + " px (" + (radius_equ * 2.0 * k * 1000).toFixed(2) + " mm)";  
}

const drawImg = () => {
    // const canvas = document.getElementById("canvas");
    // var noImg = document.getElementById("noImg");
    
    if(imgLoaded) {
        canvas.hidden = false;
        noImg.hidden = true;   
        // const imgSizeAndMarg = imgContainer.width - window.innerWidth * 0.1;
        const biggestimg = imgContainer.width / (window.innerWidth * 0.95 > 1024 ? 1024 : window.innerWidth * 0.95);
        const img_div = bigImg ? biggestimg : 8;
        // const img_div = bigImg ? 2 : 8;
        canvas.setAttribute("width", imgContainer.width/img_div);
        canvas.setAttribute("height", imgContainer.height/img_div);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(imgContainer, 0, 0, imgContainer.width/img_div, imgContainer.height/img_div);

        if(radius != -1){
            ctx.strokeStyle = "lightgreen";
            ctx.beginPath();
            ctx.ellipse(((Cu.value*2.0)/img_div) / 2, ((Cv.value*2.0)/img_div) / 2, radius / img_div, radius / img_div, 0, 0, 2 * Math.PI);
            ctx.stroke();
        }
        if(radius_equ != -1)
        {
            ctx.strokeStyle = "blue";
            ctx.beginPath();
            ctx.ellipse(((Cu.value*2.0)/img_div) / 2, ((Cv.value*2.0)/img_div) / 2, radius_equ / img_div, radius_equ / img_div, 0, 0, 2 * Math.PI);
            ctx.stroke();
        }
        if(zf != 1)
        {
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.ellipse(((Cu.value*2.0)/img_div) / 2, ((Cv.value*2.0)/img_div) / 2, radius * zf / img_div, radius * zf / img_div, 0, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
    else {
        // var canvas = document.getElementById("canvas");
        canvas.hidden = true;
        // var noImg = document.getElementById("noImg");
        noImg.hidden = false;
    }
}

const drawMask = (radius_) => {
    if(radius_ == -1)
    {
        alert("You must compute the parameter first by pressing button Submit.");
        return;
    }
    if(imgLoaded == false)
    {
        alert("You must upload an image first.");
        return;
    }
    maskCanvas.setAttribute("width", imgContainer.width);
    maskCanvas.setAttribute("height", imgContainer.height);
    const ctx = maskCanvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, imgContainer.width, imgContainer.height);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.ellipse(Cu.value, Cv.value, radius_, radius_, 0, 0, 2 * Math.PI);
    ctx.fill();

    let canvasUrl = maskCanvas.toDataURL("image/png");
    maskExport.hidden = false;
    maskExport.src = canvasUrl;
}

maskUCM.onclick = async (e) => {
    drawMask(radius);
}

maskEqu.onclick = async (e) => {
    drawMask(radius_equ);
}

maskZF.onclick = async (e) => {
    drawMask(radius_equ * zf);
}


canvas.onclick = async (e) => {
    bigImg = !bigImg;
    drawImg();
}

imgContainer.addEventListener("load", (e) => {
    imgLoaded = true;
    Cu.value = imgContainer.width / 2;
    Cv.value = imgContainer.height / 2;
    drawImg();
});

Cu.onchange = async (e) => {
    drawImg();
}

Cv.onchange = async (e) => {
    drawImg();
}

zoomFactor.onchange = async (e) => {
    computeParam();
    drawImg();
}

const load_img = () => {
    var file = document.getElementById('file').files[0];
    var reader  = new FileReader();
    reader.onload = function(e)  {

        imgContainer.src = e.target.result;
    }
    reader.readAsDataURL(file);
}

cam_param.onsubmit = async (e) => {
    e.preventDefault();
    computeParam();
    drawImg();
}