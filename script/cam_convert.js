// const Models = {
//     camera: "Camera parameters",
//     equidistant: "Equidistant parameters",
//     fisheyeOCV: "Fisheye OpenCV parameters",
//     ucm: "UCM parameters",
//     equisolid: "Equisolid parameters",
//     stereographic: "Stereographic parameters",
//     orthographic: "Ortho orthographic",
// };

var State = {
    // /** @type {Models} */
    // sourceModel: Models.camera,

    // /** @type {Array<Models>} */
    // target: [Models.equidistant],

    /** @type {Boolean} */
    imgLoaded: false,

    /** @type {Boolean} */
    bigImg: false,

    // /** @type {Number} */
    // zf: 1,

    /** @type {Array<Camera>} */
    outputCameras: [],

    /** @type {Boolean} */
    drawFoundCircleEllipse: false,
    foundCircleEllipse: {center: {x: 0, y: 0}, size: {width: 0, height: 0}, angle: 0},
}

const pageLoader = () => {
    loadHTML('template/header.html', 'header'); 
    loadHTML('template/footer.html', 'footer'); 
    resetRayAngle();


    updater();

    // TO DELETE: Fake an upload for dev purpose
    // const testImgURL = "http://127.0.0.1:3000/tmp/aaa.png";
    // fetch(testImgURL)
    //     .then(response => response.blob())
    //     .then(blob => {
    //         const imageURL = URL.createObjectURL(blob);

    //         imgContainer.src = imageURL;
    //         State.imgLoaded = true;
    //     })
    //     .catch(error => console.error("Error fetching image:", error));
    // END TO DELETE
}

const updater = () => {

    // Set the inputs
    switch(inputParamChoice.value) {
        case "cam_param" :
            // Set the inputs 
            camParam.style.display = "block";
            equiParam.style.display = "none";
            equisolidParam.style.display = "none";
            stereographic_param.style.display = "none";
            orthographic_param.style.display = "none";
            // stereographicParam.st

            // Set possible outputs
            cvtToEquidist.disabled = false;
            cvtToEquidist.title = "";
            cvtToEquidistLabel.style.color = "var(--black)";

            cvtToUCM.disabled = false;
            cvtToUCM.title = "";
            cvtToUCMLabel.style.color = "var(--black)";

            cvtToFOCV.disabled = false;
            cvtToFOCV.title = "";
            cvtToFOCVLabel.style.color = "var(--black)";

            cvtToEquisolid.disabled = false;
            cvtToEquisolid.title = "";
            cvtToEquisolidLabel.style.color = "var(--black)";

            cvtToStereographic.disabled = false;
            cvtToStereographic.title = "";
            cvtToStereographicLabel.style.color = "var(--black)";

            cvtToOrthographic.disabled = false;
            cvtToOrthographic.title = "";
            cvtToOrthographicLabel.style.color = "var(--black)";
            break;

        case "equi_param" :
            // Set the inputs 
            camParam.style.display = "none";
            equiParam.style.display = "block";
            equisolidParam.style.display = "none";
            stereographic_param.style.display = "none";
            orthographic_param.style.display = "none";

            // Set possible outputs
            cvtToEquidist.disabled = false;
            cvtToEquidist.title = "";
            cvtToEquidistLabel.style.color = "var(--black)";

            cvtToUCM.disabled = false;
            cvtToUCM.title = "";
            cvtToUCMLabel.style.color = "var(--black)";

            cvtToFOCV.disabled = false;
            cvtToFOCV.title = "";
            cvtToFOCVLabel.style.color = "var(--black)";

            cvtToEquisolid.disabled = true;
            cvtToEquisolid.checked = false;
            cvtToEquisolid.title = "Not possible with this input parameters.";
            cvtToEquisolidLabel.style.color = "var(--grey)";

            cvtToStereographic.disabled = true;
            cvtToStereographic.checked = false;
            cvtToStereographic.title = "Not possible with this input parameters.";
            cvtToStereographicLabel.style.color = "var(--grey)";

            cvtToOrthographic.disabled = true;
            cvtToOrthographic.checked = false;
            cvtToOrthographic.title = "Not possible with this input parameters.";
            cvtToOrthographicLabel.style.color = "var(--grey)";
            break;

        case "equisolid_param":
            // Set the inputs 
            camParam.style.display = "none";
            equiParam.style.display = "none";
            equisolidParam.style.display = "block";
            stereographic_param.style.display = "none";
            orthographic_param.style.display = "none";

            // Set possible outputs
            cvtToEquidist.disabled = true;
            cvtToEquidist.checked = false;
            cvtToEquidist.title = "Not possible with this input parameters.";
            cvtToEquidistLabel.style.color = "var(--grey)";

            cvtToUCM.disabled = true;
            cvtToUCM.checked = false;
            cvtToUCM.title = "Not possible with this input parameters.";
            cvtToUCMLabel.style.color = "var(--grey)";

            cvtToFOCV.disabled = true;
            cvtToFOCV.checked = false;
            cvtToFOCV.title = "Not possible with this input parameters.";
            cvtToFOCVLabel.style.color = "var(--grey)";

            cvtToEquisolid.disabled = false;
            cvtToEquisolid.checked = true;
            cvtToEquisolid.title = "";
            cvtToEquisolidLabel.style.color = "var(--black)";

            cvtToStereographic.disabled = true;
            cvtToStereographic.checked = false;
            cvtToStereographic.title = "Not possible with this input parameters.";
            cvtToStereographicLabel.style.color = "var(--grey)";

            cvtToOrthographic.disabled = true;
            cvtToOrthographic.checked = false;
            cvtToOrthographic.title = "Not possible with this input parameters.";
            cvtToOrthographicLabel.style.color = "var(--grey)";
            break;

        case "stereographic_param":
            // Set the inputs 
            camParam.style.display = "none";
            equiParam.style.display = "none";
            equisolidParam.style.display = "block";
            stereographic_param.style.display = "none";
            orthographic_param.style.display = "none";

            // Set possible outputs
            cvtToEquidist.disabled = true;
            cvtToEquidist.checked = false;
            cvtToEquidist.title = "Not possible with this input parameters.";
            cvtToEquidistLabel.style.color = "var(--grey)";

            cvtToUCM.disabled = true;
            cvtToUCM.checked = false;
            cvtToUCM.title = "Not possible with this input parameters.";
            cvtToUCMLabel.style.color = "var(--grey)";

            cvtToFOCV.disabled = true;
            cvtToFOCV.checked = false;
            cvtToFOCV.title = "Not possible with this input parameters.";
            cvtToFOCVLabel.style.color = "var(--grey)";

            cvtToEquisolid.disabled = true;
            cvtToEquisolid.checked = false;
            cvtToEquisolid.title = "Not possible with this input parameters.";
            cvtToEquisolidLabel.style.color = "var(--grey)";

            cvtToStereographic.disabled = false;
            cvtToStereographic.checked = true;
            cvtToStereographic.title = "";
            cvtToStereographicLabel.style.color = "var(--black)";

            cvtToOrthographic.disabled = true;
            cvtToOrthographic.checked = false;
            cvtToOrthographic.title = "Not possible with this input parameters.";
            cvtToOrthographicLabel.style.color = "var(--grey)";
            break;

        case "orthographic_param":
            // Set the inputs 
            camParam.style.display = "none";
            equiParam.style.display = "none";
            equisolidParam.style.display = "block";
            stereographic_param.style.display = "none";
            orthographic_param.style.display = "none";

            // Set possible outputs
            cvtToEquidist.disabled = true;
            cvtToEquidist.checked = false;
            cvtToEquidist.title = "Not possible with this input parameters.";
            cvtToEquidistLabel.style.color = "var(--grey)";

            cvtToUCM.disabled = true;
            cvtToUCM.checked = false;
            cvtToUCM.title = "Not possible with this input parameters.";
            cvtToUCMLabel.style.color = "var(--grey)";

            cvtToFOCV.disabled = true;
            cvtToFOCV.checked = false;
            cvtToFOCV.title = "Not possible with this input parameters.";
            cvtToFOCVLabel.style.color = "var(--grey)";

            cvtToEquisolid.disabled = true;
            cvtToEquisolid.checked = false;
            cvtToEquisolid.title = "Not possible with this input parameters.";
            cvtToEquisolidLabel.style.color = "var(--grey)";

            cvtToStereographic.disabled = true;
            cvtToStereographic.checked = false;
            cvtToStereographic.title = "Not possible with this input parameters.";
            cvtToStereographicLabel.style.color = "var(--grey)";

            cvtToOrthographic.disabled = false;
            cvtToOrthographic.checked = true;
            cvtToOrthographic.title = "";
            cvtToOrthographicLabel.style.color = "var(--grey)";
            break;

        default:
            alert("Problem found. Please open an issue \"Unknown input parameter choice.\".");
            break;
    }

    State.outputCameras = [];
    if(cvtToEquidist.checked) {
        switch(inputParamChoice.value) {
            case "cam_param":
                State.outputCameras.push(createCameraFromParam(
                    CameraType.Equidistant, 
                    parseFloat(camParam.querySelector("#focal_length").value),
                    createPixel(parseFloat(camParam.querySelector("#k").value)),
                    parseFloat(camParam.querySelector("#fov").value)
                ));
                break;
            
            case "equi_param":
                State.outputCameras.push(new Equidistant(
                    parseFloat(equiParam.querySelector("#f_factor").value), 
                    createPixel(parseFloat(equiParam.querySelector("#k").value)), 
                    parseFloat(equiParam.querySelector("#fov").value)
                ));
                break;

            default:
                errorMsg = "Problem found. Please open an issue \"Impossible to convert " + inputParamChoice.value + " to Equidistant\"."
                alert(errorMsg);
                throw Error(errorMsg);
        }
    }

    if(cvtToUCM.checked) {
        switch(inputParamChoice.value) {
            case "cam_param":
                State.outputCameras.push(createCameraFromParam(
                    CameraType.UCM, 
                    parseFloat(camParam.querySelector("#focal_length").value),
                    createPixel(parseFloat(camParam.querySelector("#k").value)),
                    parseFloat(camParam.querySelector("#fov").value)
                ));
                break;
            
            case "equi_param":
            {
                let intermed = new Equidistant(
                    parseFloat(equiParam.querySelector("#f_factor").value), 
                    createPixel(parseFloat(equiParam.querySelector("#k").value)), 
                    parseFloat(equiParam.querySelector("#fov").value)
                );
                State.outputCameras.push(intermed.convertTo(CameraType.UCM));
                break;
            }
                

            default:
                errorMsg = "Problem found. Please open an issue \"Impossible to convert " + inputParamChoice.value + " to UCM\"."
                alert(errorMsg);
                throw Error(errorMsg);
        }
    }

    if(cvtToFOCV.checked) {
        switch(inputParamChoice.value) {
            case "cam_param":
                State.outputCameras.push(createCameraFromParam(
                    CameraType.FisheyeOCV, 
                    parseFloat(camParam.querySelector("#focal_length").value),
                    createPixel(parseFloat(camParam.querySelector("#k").value)),
                    parseFloat(camParam.querySelector("#fov").value)
                ));
                break;
            
            case "equi_param":
            {
                let intermed = new Equidistant(
                    parseFloat(equiParam.querySelector("#f_factor").value), 
                    createPixel(parseFloat(equiParam.querySelector("#k").value)), 
                    parseFloat(equiParam.querySelector("#fov").value)
                );
                State.outputCameras.push(intermed.convertTo(CameraType.FisheyeOCV));
                break;
            }
                

            default:
                errorMsg = "Problem found. Please open an issue \"Impossible to convert " + inputParamChoice.value + " to OpenCV Fisheye\"."
                alert(errorMsg);
                throw Error(errorMsg);
        }
    }

    if(cvtToEquisolid.checked) {
        switch(inputParamChoice.value) {
            case "cam_param":
                State.outputCameras.push(createCameraFromParam(
                    CameraType.Equisolid, 
                    parseFloat(camParam.querySelector("#focal_length").value),
                    createPixel(parseFloat(camParam.querySelector("#k").value)),
                    parseFloat(camParam.querySelector("#fov").value)
                ));
                break;
            
            case "equisolid_param":
                State.outputCameras.push(new Equisolid(
                    parseFloat(equiParam.querySelector("#f_factor").value), 
                    createPixel(parseFloat(equiParam.querySelector("#k").value)), 
                    parseFloat(equiParam.querySelector("#fov").value)
                ));
                break;

            default:
                errorMsg = "Problem found. Please open an issue \"Impossible to convert " + inputParamChoice.value + " to Equisolid\"."
                alert(errorMsg);
                throw Error(errorMsg);
        }
    }

    if(cvtToStereographic.checked) {
        switch(inputParamChoice.value) {
            case "cam_param":
                State.outputCameras.push(createCameraFromParam(
                    CameraType.Stereographic, 
                    parseFloat(camParam.querySelector("#focal_length").value),
                    createPixel(parseFloat(camParam.querySelector("#k").value)),
                    parseFloat(camParam.querySelector("#fov").value)
                ));
                break;
            
            case "stereographic_param":
                State.outputCameras.push(new Stereographic(
                    parseFloat(equiParam.querySelector("#f_factor").value), 
                    createPixel(parseFloat(equiParam.querySelector("#k").value)), 
                    parseFloat(equiParam.querySelector("#fov").value)
                ));
                break;

            default:
                errorMsg = "Problem found. Please open an issue \"Impossible to convert " + inputParamChoice.value + " to Equisolid\"."
                alert(errorMsg);
                throw Error(errorMsg);
        }
    }

    if(cvtToOrthographic.checked) {
        console.log("coucou" + cvtToOrthographic.value);
        switch(inputParamChoice.value) {
            case "cam_param":
                State.outputCameras.push(createCameraFromParam(
                    CameraType.Orthographic, 
                    parseFloat(camParam.querySelector("#focal_length").value),
                    createPixel(parseFloat(camParam.querySelector("#k").value)),
                    parseFloat(camParam.querySelector("#fov").value)
                ));
                break;
            
            case "orthographic_param":
                State.outputCameras.push(new Orthographic(
                    parseFloat(equiParam.querySelector("#f_factor").value), 
                    createPixel(parseFloat(equiParam.querySelector("#k").value)), 
                    parseFloat(equiParam.querySelector("#fov").value)
                ));
                break;

            default:
                errorMsg = "Problem found. Please open an issue \"Impossible to convert " + inputParamChoice.value + " to Equisolid\"."
                alert(errorMsg);
                throw Error(errorMsg);
        }
    }

    const maxPerRow = 2;
    var nInRow = 0, nInAll = 0; 
    outParams.innerHTML = "";


    MaskToGenerate.innerHTML = "";
    State.outputCameras.forEach(outCam => {
        if(nInRow == 0)
        {
            outParams.innerHTML += "<div id=\"outParamRow\"></div><br>";
        }

        targetDivPack = outParams.querySelectorAll("#outParamRow")[outParams.querySelectorAll("#outParamRow").length - 1];
        // outParamRow instanceof HTMLCollection ? outParamRow[outParamRow.length - 1] : outParamRow;

        // class=\"paramBloc\"
        targetDivPack.innerHTML += "<div  id=\"outParamBloc\"><h3>"+ outCam.typeName +"</h3></div>";
        lastMadeDiv = targetDivPack.querySelectorAll("div")[targetDivPack.querySelectorAll("div").length - 1]; 

        outCam.conversions.forEach(conv => {
            lastMadeDiv.innerHTML += conv + " &rightarrow; ";
        });
        lastMadeDiv.innerHTML += outCam.typeName + "<br><br>";

        lastMadeDiv.innerHTML += outCam.exportHTMLBlock();

        const idName = "dispImgCirc"+ nInAll;

        lastMadeDiv.innerHTML += "<span><label for=\"dispImgCirc\">Display the image circle</label>: <input type=\"checkbox\" id=\""+ idName +"\" data-camera-id=\"" + nInAll + "\" name=\"dispImgCirc\"/><span>";

        MaskToGenerate.innerHTML += "<label><input type=\"radio\" name=\"maskOutSelection\" value=\"" + nInAll + "\"> " + outCam.typeName + "</label><br>";

        // ADD Radio button for the mask
        

        // const test = lastMadeDiv.querySelector("#dispImgCirc");
        
        // test.

        nInRow++;
        nInAll++;
        if(nInRow >= maxPerRow) nInRow = 0;
    }); 

    const checkBoxes = outParams.querySelectorAll("input");
    checkBoxes.forEach(labox => {
        labox.addEventListener('change', event => {
            State.outputCameras[event.target.dataset.cameraId].drawImgCircle = event.target.checked;
            drawImg();
        });      
    });
}

const drawImg = () => {    
    if(State.imgLoaded) {
        canvas.style.display = 'block';
        noImg.style.display = 'none';   

        const biggestimg = imgContainer.width / (window.innerWidth * 0.95 > 1024 ? 1024 : window.innerWidth * 0.95);
        const img_div = State.bigImg ? biggestimg : 8;
        // const img_div = bigImg ? 2 : 8;
        canvas.setAttribute("width", imgContainer.width/img_div);
        canvas.setAttribute("height", imgContainer.height/img_div);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(imgContainer, 0, 0, imgContainer.width/img_div, imgContainer.height/img_div);


        State.outputCameras.forEach(cam => {
            if(cam.drawImgCircle) {
                const radius = cam.ray(radians(parseFloat(MaxRayAngle.value)));
                ctx.strokeStyle = cam.color;
                ctx.beginPath();
                ctx.ellipse(((Cu.value*2.0)/img_div) / 2, ((Cv.value*2.0)/img_div) / 2, radius / img_div, radius / img_div, 0, 0, 2 * Math.PI);
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });

        if(State.drawFoundCircleEllipse) {
            const centerX = (State.foundCircleEllipse.center.x*2.0/img_div) / 2;
            const centerY = (State.foundCircleEllipse.center.y*2.0/img_div) / 2;
            const radiusX = State.foundCircleEllipse.size.width / 2.0 / img_div;  
            const radiusY = State.foundCircleEllipse.size.height / 2.0 / img_div;  
            const rotation = State.foundCircleEllipse.angle;
            const startAngle = 0;
            const endAngle = 2 * Math.PI;

            ctx.beginPath();
            ctx.ellipse(centerX, centerY, radiusX, radiusY, rotation, startAngle, endAngle);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

    }
    else {
        // var canvas = document.getElementById("canvas");
        canvas.style.display = 'none';
        // var noImg = document.getElementById("noImg");
        noImg.style.display = 'block';
    }
}

const drawMask = () => {
    if(State.imgLoaded == false)
    {
        alert("You must upload an image first.");
        return;
    }

    var radius_ = 0;
    const radioMask = MaskToGenerate.querySelectorAll("input");
    radioMask.forEach(radio => {
        if(radio.checked) {
            const cam = State.outputCameras[radio.value];
            let angle = radians(parseFloat(MaxRayAngle.value));
            radius_ = cam.ray(angle);
        }
    });

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
    downloadMaskImgButton.hidden = false;
    // downloadMaskImg.hidden = false;
    downloadMaskImg.href = maskCanvas.toDataURL("image/png");
    downloadMaskImg.download = 'MaskImage.png';

    // downloadMaskImg.click();
}


/**
 * search for image circle from the image and set the center to Cu and Cv.
 */
const searchImgCenter = () => {
    let src = cv.imread(imgContainer);
    let buffBin = new cv.Mat();
    let srcdst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
    cv.cvtColor(src, buffBin, cv.COLOR_RGB2GRAY, 0);
    cv.threshold(buffBin, buffBin, 80, 255, cv.THRESH_BINARY);
    let M = cv.Mat.ones(65, 65, cv.CV_8U);
    cv.morphologyEx(buffBin, buffBin, cv.MORPH_CLOSE, M);
    cv.morphologyEx(buffBin, buffBin, cv.MORPH_CLOSE, M);
    cv.morphologyEx(buffBin, buffBin, cv.MORPH_CLOSE, M);

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(buffBin, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let cnt = contours.get(0);
    let rotatedRect = cv.fitEllipse(cnt);

    // // let contoursColor = new cv.Scalar(255, 255, 255);
    // let ellipseColor = new cv.Scalar(255, 0, 0);
    // // cv.drawContours(src, contours, 0, contoursColor, 1, 8, hierarchy, 100);
    // cv.ellipse1(src, rotatedRect, ellipseColor, 1, cv.LINE_8);

    console.log(rotatedRect);
    // cv.imshow("outputCanvas", src);

    let foundCenter = {x: Math.round(rotatedRect.center.x), y: Math.round(rotatedRect.center.y)};

    Cu.value = foundCenter.x;
    Cv.value = foundCenter.y;

    State.foundCircleEllipse = rotatedRect;

    drawImg();
}

const resetCuCv = () => {
    Cu.value = imgContainer.width / 2;
    Cv.value = imgContainer.height / 2;
    drawImg();
}
 
const resetRayAngle = () => {
    MaxRayAngle.value = parseFloat(camParam.querySelector("#fov").value) / 2.0;
}

const load_img = () => {
    var file = document.getElementById('file').files[0];
    console.log('Received an image'); 
    var reader  = new FileReader();
    reader.onload = function(e)  {
        imgContainer.src = e.target.result;
        State.imgLoaded = true;
    }
    reader.readAsDataURL(file);
}

canvas.onclick = async (e) => {
    State.bigImg = !State.bigImg;
    drawImg();
}

imgContainer.addEventListener("load", (e) => {
    State.imgLoaded = true;
    resetCuCv();
});

Cu.onchange = async (e) => {
    State.foundCircleEllipse.center.x = Cu.value;
    drawImg();
}

Cv.onchange = async (e) => {
    State.foundCircleEllipse.center.y = Cv.value;
    drawImg();
}

MaxRayAngle.oninput = async (e) => {
    drawImg();
}

showEllipse.onchange = async (e) => {
    State.drawFoundCircleEllipse = showEllipse.checked;
    console.log(showEllipse.checked);
    drawImg();
}