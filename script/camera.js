/**
 * Convert degres to radians
 * @param {Number} deg degres
 * @returns {Number} radians
 */
const radians = (deg) => deg * Math.PI / 180.0;

/**
 * Give the angle within the fov 
 * @param {*} n 
 * @param {*} fov 
 * @returns 
 */
const phi = (n, fov) => {
    return (- radians(fov) / 2.0) + (parseFloat(n) * radians(1));
}

/**
 * @typedef {Object} Size
 * @property {Number} x - The x size, initially null.
 * @property {Number} y - The y size, initially null.
 */

/**
 * Create a pixel size
 * @param {Number} kx Size on x axis
 * @param {Number} ky (optional) Sise on y axis
 * @returns {Size} 
 */
const createPixel = (kx, ky=null) => {
    if(ky === null) {
        return {x: kx, y: kx};
    } else {
        return {x: kx, y: ky};
    }
}


const CameraType = {
    Perspective: "perspective",
    Equidistant: "equidistant",
    FisheyeOCV: "opencv fisheye",
    UCM: "unified central model",
}

/**
 * 
 * @param {CameraType} cameraType 
 * @param {Number} focal 
 * @param {{x: Number, y: Number}} pixSize 
 * @param {Number} fov 
 * @returns a camera
 */
const createCameraFromParam = (cameraType, focal, pixSize, fov) => {
    switch(cameraType) {
        case CameraType.Perspective:
        {
            let intermed = new Perspective(focal, pixSize, fov);
            intermed.conversions.push("Parameters");
            return intermed;
        }
            
        case CameraType.Equidistant:
        {
            let intermed = new Equidistant(focal/pixSize.x, pixSize, fov);
            intermed.conversions.push("Parameters");
            return intermed
        }
            
        case CameraType.FisheyeOCV:
        {
            let intermed = new Equidistant(focal/pixSize.x, pixSize, fov);
            intermed.conversions.push("Parameters");
            return intermed.convertTo(CameraType.FisheyeOCV);
        }
            
        case CameraType.UCM:
        {
            let intermed = new Equidistant(focal/pixSize.x, pixSize, fov);
            intermed.conversions.push("Parameters");
            return intermed.convertTo(CameraType.UCM);
        }
            

        default:
            throw Error("Unknown camera type: " + cameraType);
    }
} 

class Camera {
    /** 
     * FOV of the camera
     * @type {Number} */
    fov = null;

    /**
     * Size of a pixel
     *  @type {Size} */
    pixSize = {x: null, y: null};

    /**
     * Applied conversion to reach this model
     *  @type {Array<String>} */
    conversions = [];

    /**
     * Residual from the conversion
     *  @type {Number} */
    residual_ = null;

    /**
     * Draw the image circle on the Canvas
     *  @type {Boolean} */
    drawImgCircle = false;

    /**
     * Name of the model to be displayed
     *  @type {String} */
    typeName = "";

    /**
     * Color of the image circle
     *  @type {String} */
    color = "";

    constructor() {
        if (new.target === Camera) {
            throw new Error("Cannot instantiate an interface directly.");
        }
    }

    /**
     * Compute the distance between the image circle and the point drawn by a ray with a given incident angle.
     * @param {number} angle in radians 
     * @returns distance to image circle center
     */
    ray(angle) {
        throw new Error("Method 'ray' must be implemented.");
    }

    /**
     * Exports the HTML block with parameters (and warning if any)
     * @returns {String}
     */
    exportHTMLBlock() {
        throw new Error("Method 'exportHTMLBlock' must be implemented.");
    }

    /**
     * Exports to another camera model
     * @param {CameraType} camType 
     * @returns {Perspective | Equidistant | FisheyeOCV | UCM} the camera object
     */
    convertTo(camType) {
        throw new Error("Method 'exportHTMLBlock' must be implemented.");
    }
}


class Perspective extends Camera {
    /** @type {Number} */
    focal = null;
    /** @type {Number} */
    alpha_x = null;
    /** @type {Number} */
    alpha_y = null;
    typeName = "Perspective";
    color = "Yellow";

    constructor(focal, pixSize, fov, residual_ = null) {
        super();
        this.focal = focal;
        this.fov = fov;
        this.pixSize = pixSize;
        this.alpha_x = this.focal / this.pixSize.x;
        this.alpha_y = this.focal / this.pixSize.y;
        this.residual_ = residual_;
    }

    ray(angle)
    {
        return this.alpha_x * Math.tan(angle)
    }

    exportHTMLBlock()
    {
        var HTMLcode = "<table><caption>Parameters:</caption>";
        HTMLcode += "<tr><td>&alpha;</td><td>" + (this.alpha_x).toFixed(3) + "</td><td></td></tr>";
        HTMLcode += "<tr><td>Image circle</td><td>" + (this.ray(radians(this.fov/2.0)) * 2.0).toFixed(0) + "</td><td>px</td></tr>";
        HTMLcode += "<tr><td>Image circle</td><td>" + (this.ray(radians(this.fov/2.0)) * 2000.0 * this.pixSize.x).toFixed(2) + "</td><td>mm</td></tr>";
        HTMLcode += "</table>"
        return HTMLcode;
    }

    #toEquidistant()
    {
        intermed = new Equidistant(this.alpha_x, this.pixSize, this.fov);
        intermed.conversions = this.conversions;
        intermed.conversions.push("Perspective");
        return intermed;
    }

    convertTo(camType) {
        switch(camType) {
            case CameraType.Equidistant:
                return this.#toEquidistant();
                break;

            default:
                throw new Error("Impossible conversion to " + camType);
        }
    }
}

class Equidistant extends Camera {
    /** @type {Number} */
    alpha_x = null;
    /** @type {Number} */
    alpha_y = null;
    typeName = "Equidistant";
    color = "Tomato";

    constructor(alpha_x, pixSize, fov, residual_=null) {
        super();
        this.alpha_x = alpha_x;
        this.pixSize = pixSize;
        this.fov = fov;
        this.residual_ = residual_;
    }

    ray(angle) {
        return this.alpha_x * angle;
    }

    exportHTMLBlock()
    {
        var HTMLcode = "<table><caption>Parameters:</caption>";
        HTMLcode += "<tr><td>&alpha;</td><td><pre>" + (this.alpha_x).toFixed(3) + "</pre></td><td></td></tr>";
        HTMLcode += "<tr><td>Image circle</td><td><pre>" + (this.ray(radians(this.fov/2.0)) * 2.0).toFixed(0) + "</pre></td><td>px</td></tr>";
        HTMLcode += "<tr><td>Image circle</td><td><pre>" + (this.ray(radians(this.fov/2.0)) * 2000.0 * this.pixSize.x).toFixed(2) + "</pre></td><td>mm</td></tr>";
        HTMLcode += "</table>"
        return HTMLcode;
    }

    #toFisheyeOCV()
    {
        let intermed =  new FisheyeOCV(this.alpha_x, 0, 0, 0, 0, this.pixSize, this.fov);
        intermed.conversions = this.conversions;
        intermed.conversions.push("Equidistant");
        return intermed;
    }

    #toUCM()
    {
        const N = Math.round(this.fov) + 1;
        var A = math.ones(N, 2);
        A = math.multiply(A, -1.0);
        var b = math.zeros(N, 1);

        for(let i = 0; i<N; i ++) 
        {
            var p = phi(i, this.fov);
            
            if(0 == p) 
                p = 0.000000000000001; // Avoid division by 0
            A.set([i, 0], Math.sin(p) / (p * this.alpha_x));
            b.set([i, 0], Math.cos(p));
        }
        var pinvA = math.pinv(A);
        var param = math.multiply(pinvA, b);
        var alpha_x_ucm = math.subset(param, math.index(0, 0));
        var xi = math.subset(param, math.index(1, 0));

        var residual_ = 0.0; 
        for(let i = 0; i<N; i ++)
        {
            p = phi(i, this.fov);
            residual_ += Math.pow(((this.alpha_x_ucm * Math.sin(p)) / (Math.cos(p) + xi) - (p * this.alpha_x)), 2);
        }
        residual_ = Math.sqrt(residual_) / parseFloat(N);
        let intermed = new UCM(alpha_x_ucm, xi, this.pixSize, this.fov, residual_);
        intermed.conversions = this.conversions;
        intermed.conversions.push("Equidistant");
        return intermed;
    }

    convertTo(camType) {
        switch(camType) {
            case CameraType.FisheyeOCV:
                return this.#toFisheyeOCV();
                break;

            case CameraType.UCM:
                return this.#toUCM();
                break;

            default:
                throw new Error("Impossible conversion to " + camType);
        }
    }
}

class FisheyeOCV extends Camera {
    /** @type {Number} */
    alpha_x = null;
    /** @type {Number} */
    alpha_y = null;
    /** @type {Number} */
    k1 = 0.0;
    /** @type {Number} */
    k2 = 0.0;
    /** @type {Number} */
    k3 = 0.0;
    /** @type {Number} */
    k4 = 0.0;
    typeName = "OpenCV Fisheye";
    color = "SpringGreen";


    constructor(alpha_x, k1, k2, k3, k4, pixSize, fov, residual_=null) {
        super();
        this.alpha_x = alpha_x;
        this.pixSize = pixSize;
        this.fov = fov;
        this.k1 = k1;
        this.k2 = k2;
        this.k3 = k3;
        this.k4 = k4;
        this.residual_ = residual_;
    }

    /**
     * 
     * @param {number} angle in radians
     * @returns distorded angle.
     */
    angleDistorded(angle) {
        return angle * (1.0 + this.k1 * Math.pow(angle, 2) + this.k2 * Math.pow(angle, 4) + this.k3 * Math.pow(angle, 6) + this.k4 * Math.pow(angle, 8));
    }

    ray(angle) {
        return this.alpha_x * this.angleDistorded(angle);
    }

    exportHTMLBlock()
    {
        var HTMLcode = "<table><caption>Parameters:</caption>";
        HTMLcode += "<tr><td>&alpha;</td><td><pre>" + (this.alpha_x).toFixed(3) + "</pre></td><td></td></tr>";
        HTMLcode += "<tr><td>k1</td><td><pre>" + (this.k1).toFixed(3) + "</pre></td><td></td></tr>";
        HTMLcode += "<tr><td>k2</td><td><pre>" + (this.k2).toFixed(3) + "</pre></td><td></td></tr>";
        HTMLcode += "<tr><td>k3</td><td><pre>" + (this.k3).toFixed(3) + "</pre></td><td></td></tr>";
        HTMLcode += "<tr><td>k4</td><td><pre>" + (this.k4).toFixed(3) + "</pre></td><td></td></tr>";
        HTMLcode += "<tr><td>Image circle</td><td><pre>" + (this.ray(radians(this.fov/2.0)) * 2.0).toFixed(0) + "</pre></td><td>px</td></tr>";
        HTMLcode += "<tr><td>Image circle</td><td><pre>" + (this.ray(radians(this.fov/2.0)) * 2000.0 * this.pixSize.x).toFixed(2) + "</pre></td><td>mm</td></tr>";
        HTMLcode += "</table>"
        if(this.fov >= 180.0)
        {
            HTMLcode += "<table><tr><td>&#9888;</td><td style=\"font-weight: bold;\">OpenCV fisheye does not work with <span title=\"Field Of View\">FOV</span> &GreaterEqual; 180&deg;</td><td>&#9888;</td></tr></table>"
        }
        return HTMLcode;
    }

    convertTo(camType) {
        switch(camType) {
            default:
                throw new Error("Impossible conversion to " + camType);
        }
    }
}

class UCM extends Camera {
    /** @type {Number} */
    xi = 0.0;
    /** @type {Number} */
    alpha_x = null;
    /** @type {Number} */
    alpha_y = null;
    typeName = "UCM";
    color = "Magenta";

    constructor(alpha_x, xi, pixSize, fov, residual_=null) {
        super();
        this.alpha_x = alpha_x;
        this.xi = xi;
        this.pixSize = pixSize;
        this.fov = fov;
        this.residual_ = residual_;
    }

    ray(angle) {
        const xlim = Math.cos(radians(90) - angle);
        const zlim = Math.sin(radians(90) - angle);
        return this.alpha_x * xlim / (this.xi + zlim);
    }

    exportHTMLBlock()
    {
        var HTMLcode = "<table><caption>Parameters:</caption>";
        HTMLcode += "<tr><td>&alpha;</td><td><pre>" + (this.alpha_x).toFixed(3) + "</pre></td><td></td></tr>";
        HTMLcode += "<tr><td>&xi;</td><td><pre>" + (this.xi).toFixed(3) + "</pre></td><td></td></tr>";
        HTMLcode += "<tr><td>Image circle</td><td><pre>" + (this.ray(radians(this.fov/2.0)) * 2.0).toFixed(0) + "</pre></td><td>px</td></tr>";
        HTMLcode += "<tr><td>Image circle</td><td><pre>" + (this.ray(radians(this.fov/2.0)) * 2000.0 * this.pixSize.x).toFixed(2) + "</pre></td><td>mm</td></tr>";
        HTMLcode += "</table>"
        return HTMLcode;
    }

    convertTo(camType) {
        switch(camType) {
            default:
                throw new Error("Impossible conversion to " + camType);
        }
    }
}