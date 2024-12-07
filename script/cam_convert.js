var State = {
    imgLoaded: false,
    bigImg: false,
    zf: 1,

    camEquist: null,
    camUCM: null,
    camFOCV: null,
}

const computeParam = () => {
    form = new FormData(cam_param);
    const f = parseFloat(form.get("f_length"));
    const fov = parseFloat(form.get("fov"));
    const k = parseFloat(form.get("pix_elem_size"));
    // State.zf = zoomFactor.value;

    if(fov >= 180) {
        WARNFOCV.style.display = 'block';
    }
    else
    {
        WARNFOCV.style.display = 'none';
    }

    State.camEquist = new Equidistant(f, {x: k, y: k}, fov);
    State.camUCM = new UCM(f, {x: k, y: k}, fov);
    var conversionResibual = State.camUCM.fromEquidistant();
    State.camFOCV = new FisheyeOCV(f, {x: k, y: k}, fov);

    f_au.innerHTML =        (State.camUCM.alpha_x_ucm).toFixed(2); 
    // + (State.zf != 1 ? "<br>(corrected: " + (State.camUCM.alpha_x_ucm * State.zf).toFixed(2) + " )" : "");
    f_au_equi.innerHTML =   (State.camEquist.alpha_x).toFixed(2); 
    // + (State.zf != 1 ? "<br>(corrected: " + (State.camEquist.alpha_x * State.zf).toFixed(2) + " )" : "");
    f_au_kb.innerHTML =     (State.camFOCV.alpha_x).toFixed(2); 
    // + (State.zf != 1 ? "<br>(corrected: " + (State.camFOCV.alpha_x * State.zf).toFixed(2) + " )" : "");
    Xi.innerHTML =          (State.camUCM.xi).toFixed(5);
    residual.innerHTML =    (conversionResibual).toFixed(5);

    var angleMax = radians(fov / 2.0);
    img_circ.innerHTML = (State.camUCM.ray(angleMax) * 2.0).toFixed(2) + " px<br>(" + (State.camUCM.ray(angleMax) * 2.0 * k * 1000).toFixed(2) + " mm)";
    img_circ_equ.innerHTML = (State.camEquist.ray(angleMax) * 2.0).toFixed(2) + " px<br>(" + (State.camEquist.ray(angleMax) * 2.0 * k * 1000).toFixed(2) + " mm)";  
    img_circ_focv.innerHTML = (State.camFOCV.ray(angleMax) * 2.0).toFixed(2) + " px<br>(" + (State.camFOCV.ray(angleMax) * 2.0 * k * 1000).toFixed(2) + " mm)";
}

const drawImg = () => {
    // const canvas = document.getElementById("canvas");
    // var noImg = document.getElementById("noImg");
    
    if(State.imgLoaded) {
        canvas.style.display = 'block';
        noImg.style.display = 'none';   



        // const imgSizeAndMarg = imgContainer.width - window.innerWidth * 0.1;

        const biggestimg = imgContainer.width / (window.innerWidth * 0.95 > 1024 ? 1024 : window.innerWidth * 0.95);
        const img_div = State.bigImg ? biggestimg : 8;
        // const img_div = bigImg ? 2 : 8;
        canvas.setAttribute("width", imgContainer.width/img_div);
        canvas.setAttribute("height", imgContainer.height/img_div);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(imgContainer, 0, 0, imgContainer.width/img_div, imgContainer.height/img_div);

        if(imgCircEqui.checked)
        {
            const radius = State.camEquist.ray(radians(parseFloat(MaxRayAngle.value)));
            ctx.strokeStyle = "lightgreen";
            ctx.beginPath();
            ctx.ellipse(((Cu.value*2.0)/img_div) / 2, ((Cv.value*2.0)/img_div) / 2, radius / img_div, radius / img_div, 0, 0, 2 * Math.PI);
            ctx.stroke();
        }
        // if(radius != -1){
        //     ctx.strokeStyle = "lightgreen";
        //     ctx.beginPath();
        //     ctx.ellipse(((Cu.value*2.0)/img_div) / 2, ((Cv.value*2.0)/img_div) / 2, radius / img_div, radius / img_div, 0, 0, 2 * Math.PI);
        //     ctx.stroke();
        // }
        // if(radius_equ != -1)
        // {
        //     ctx.strokeStyle = "blue";
        //     ctx.beginPath();
        //     ctx.ellipse(((Cu.value*2.0)/img_div) / 2, ((Cv.value*2.0)/img_div) / 2, radius_equ / img_div, radius_equ / img_div, 0, 0, 2 * Math.PI);
        //     ctx.stroke();
        // }
        // if(zf != 1)
        // {
        //     ctx.strokeStyle = "red";
        //     ctx.beginPath();
        //     ctx.ellipse(((Cu.value*2.0)/img_div) / 2, ((Cv.value*2.0)/img_div) / 2, radius * zf / img_div, radius * zf / img_div, 0, 0, 2 * Math.PI);
        //     ctx.stroke();
        // }
    }
    else {
        // var canvas = document.getElementById("canvas");
        canvas.style.display = 'none';
        // var noImg = document.getElementById("noImg");
        noImg.style.display = 'block';
    }
}

// const drawMask = (radius_) => {
//     if(radius_ == -1)
//     {
//         alert("You must compute the parameter first by pressing button Submit.");
//         return;
//     }
//     if(imgLoaded == false)
//     {
//         alert("You must upload an image first.");
//         return;
//     }
//     maskCanvas.setAttribute("width", imgContainer.width);
//     maskCanvas.setAttribute("height", imgContainer.height);
//     const ctx = maskCanvas.getContext("2d");
//     ctx.fillStyle = "black";
//     ctx.fillRect(0, 0, imgContainer.width, imgContainer.height);
//     ctx.fill();
//     ctx.fillStyle = "white";
//     ctx.beginPath();
//     ctx.ellipse(Cu.value, Cv.value, radius_, radius_, 0, 0, 2 * Math.PI);
//     ctx.fill();

//     let canvasUrl = maskCanvas.toDataURL("image/png");
//     maskExport.hidden = false;
//     maskExport.src = canvasUrl;
//     downloadMaskImg.hidden = false;
//     downloadMaskImg.href = maskCanvas.toDataURL("image/png");
//     downloadMaskImg.download = 'MaskImage.png';
// }

// maskUCM.onclick = async (e) => {
//     drawMask(radius);
// }

// // maskEqu.onclick = async (e) => {
// //     drawMask(radius_equ);
// // }

// maskZF.onclick = async (e) => {
//     drawMask(radius_equ * zf);
// }

canvas.onclick = async (e) => {
    State.bigImg = !State.bigImg;
    // drawImg();
}

imgContainer.addEventListener("load", (e) => {
    State.imgLoaded = true;
    Cu.value = imgContainer.width / 2;
    Cv.value = imgContainer.height / 2;
    // drawImg();
});

// Cu.onchange = async (e) => {
//     drawImg();
// }

// Cv.onchange = async (e) => {
//     drawImg();
// }

// MaxRayAngle.onchange = async (e) => {
//     computeParam();
//     drawImg();
// }

// zoomFactor.onchange = async (e) => {
//     computeParam();
//     // drawImg();
// }

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