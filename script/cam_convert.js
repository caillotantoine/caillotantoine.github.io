cam_param.onsubmit = async (e) => {
    e.preventDefault();
    form = new FormData(cam_param)

    const f = parseFloat(form.get("f_length"));
    const fov = parseFloat(form.get("fov"));
    const k = parseFloat(form.get("pix_elem_size"));
    const w = parseFloat(form.get("sensor_width"));
    const h = parseFloat(form.get("sensor_height"));
    const zf = parseFloat(form.get("zoomFactor"));

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
    residual = 0.0;
    for(let i = 0; i<N; i ++)
    {
        residual += Math.pow(((fau * Math.sin(phi(i))) / (Math.cos(phi(i)) + xi) - ufe(i)), 2);
    }
    residual = Math.sqrt(residual) / parseFloat(N);

    document.getElementById("f_au").innerHTML = fau + (zf != 1 ? " (corrected: " + (fau * zf) + " )" : "");
    document.getElementById("f_au_equi").innerHTML = fau_equi + (zf != 1 ? " (corrected: " + (fau_equi * zf) + " )" : "");
    document.getElementById("f_au_kb").innerHTML = fau_equi + (zf != 1 ? " (corrected: " + (fau_equi * zf) + " )" : "");
    document.getElementById("Xi").innerHTML = xi;
    document.getElementById("residual").innerHTML = residual;

    const angle_max = radians(90) - (radians(fov) / 2.0);
    const xlim = Math.cos(angle_max);
    const zlim = Math.sin(angle_max);
    const diameter = fau * xlim / (xi - zlim);

    var imgValid = true;

    try
    {
        var file = document.getElementById('file').files[0];
        var reader  = new FileReader();
        reader.onload = function(e)  {
            var imgCont = document.getElementById("imgContainer");
            imgCont.src = e.target.result;
        }
        reader.readAsDataURL(file);

        

        const image = document.getElementById("imgContainer");
        image.addEventListener("load", (e) => {
            const canvas = document.getElementById("canvas");
            canvas.hidden = false;
            var noImg = document.getElementById("noImg");
            noImg.hidden = true;   
            canvas.setAttribute("width", image.width/8+20);
            canvas.setAttribute("height", image.height/8+20);
            const ctx = canvas.getContext("2d");
            ctx.drawImage(image, 10, 10, image.width/8, image.height/8);
            ctx.strokeStyle = "lightgreen";
            ctx.beginPath();
            ctx.ellipse((image.width/8+20) / 2, (image.height/8+20) / 2, diameter / 8, diameter / 8, 0, 0, 2 * Math.PI);
            ctx.stroke();
            if(zf != 1)
            {
                ctx.strokeStyle = "red";
                ctx.beginPath();
                ctx.ellipse((image.width/8+20) / 2, (image.height/8+20) / 2, diameter * zf / 8, diameter * zf / 8, 0, 0, 2 * Math.PI);
                ctx.stroke();
            }
            
        });
    }
    catch 
    {
        var canvas = document.getElementById("canvas");
        canvas.hidden = true;
        var noImg = document.getElementById("noImg");
        noImg.hidden = false;
        // canvas.parentNode.replaceChild(noImg, canvas);
    }
}