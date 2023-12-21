cam_param.onsubmit = async (e) => {
    e.preventDefault();
    form = new FormData(cam_param)

    const f = parseFloat(form.get("f_length"));
    const fov = parseFloat(form.get("fov"));
    const k = parseFloat(form.get("pix_elem_size"));
    const w = parseFloat(form.get("sensor_width"));
    const h = parseFloat(form.get("sensor_height"));

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
    document.getElementById("f_au").innerHTML = fau;
    document.getElementById("f_au_equi").innerHTML = fau_equi;
    document.getElementById("f_au_kb").innerHTML = fau_equi;
    document.getElementById("Xi").innerHTML = xi;
    document.getElementById("residual").innerHTML = residual;
}