const radians = (deg) => deg * Math.PI / 180.0;

const phi = (n, fov) => {
    return (- radians(fov) / 2.0) + (parseFloat(n) * radians(1));
}

class Camera {
    focal = null;
    fov = null;
    pixSize = {x: null, y: null};
    alpha_x = null;
    alpha_y = null;

    imgsize = {width: null, heigh: null};
    center = {cu: null, cv: null};

    zoomFactor = 1.0;

    constructor(focal, pixSize, fov) {
        this.focal = focal;
        this.fov = fov;
        this.pixSize = pixSize;
        this.alpha_x = this.focal / this.pixSize.x;
        this.alpha_y = this.focal / this.pixSize.y;
    }

    /**
     * Compute the distance between the image circle and the point drawn by a ray with a given incident angle.
     * @param {number} angle in radians 
     * @returns distance to image circle center
     */
    ray(angle)
    {
        return this.alpha_x * Math.tan(angle)
    }
}

class Equidistant extends Camera {
    constructor(focal, pixSize, fov=null) {
        super(focal, pixSize, fov);
    }

    ray(angle) {
        return this.alpha_x * angle;
    }
}

class FisheyeOCV extends Camera {
    k1 = 0.0;
    k2 = 0.0;
    k3 = 0.0;
    k4 = 0.0;

    constructor(focal, pixSize, fov = null) {
        super(focal, pixSize, fov);
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
}

class UCM extends Camera {
    xi = 0.0;
    alpha_x_ucm = 0.0;

    constructor(focal, pixSize, fov) {
        super(focal, pixSize, fov);
    }

    /**
     * Build the camera from an equidistant
     * @param {Equidistant} equiCam camera as equidistant
     * @returns residuals
     */
    fromEquidistant(equiCam=null) {
        var fov = 0.0, alpha_x = 0.0;
        if(equiCam === null)
        {
            fov = this.fov;
            alpha_x = this.alpha_x;
        }
        else
        {
            if(equiCam.fov === null) {
                throw new Error("Equidistant camera has no FOV set. Please set one before.");
            }
                
            fov = equiCam.fov;
            alpha_x = equiCam.alpha_x;
        }

        const N = Math.round(fov) + 1;
        var A = math.ones(N, 2);
        A = math.multiply(A, -1.0);
        var b = math.zeros(N, 1);

        for(let i = 0; i<N; i ++) 
        {
            var p = phi(i, fov);
            
            if(0 == p) 
                p = 0.000000000000001; // Avoid division by 0
            A.set([i, 0], Math.sin(p) / (p * alpha_x));
            b.set([i, 0], Math.cos(p));
        }
        var pinvA = math.pinv(A);
        var param = math.multiply(pinvA, b);
        this.alpha_x_ucm = math.subset(param, math.index(0, 0));
        this.xi = math.subset(param, math.index(1, 0));

        var residual_ = 0.0; 
        for(let i = 0; i<N; i ++)
        {
            p = phi(i, fov);
            residual_ += Math.pow(((this.alpha_x_ucm * Math.sin(p)) / (Math.cos(p) + this.xi) - (p * alpha_x)), 2);
        }
        residual_ = Math.sqrt(residual_) / parseFloat(N);
        return residual_
    }

    ray(angle) {
        const xlim = Math.cos(radians(90) - angle);
        const zlim = Math.sin(radians(90) - angle);
        return this.alpha_x * xlim / (this.xi + zlim);
    }
}