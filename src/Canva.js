import React, {useRef, useEffect} from 'react'

class Vector {
    constructor(x, y) {
        this.angle = Math.random() * Math.PI * 2;
        this.posx = x;
        this.posy = y;
        this.x = Math.cos(this.angle);
        this.y = Math.sin(this.angle);
    }
}

class Square {
    constructor(nw, ne, se, sw) {
        this.nw = nw;
        this.ne = ne;
        this.sw = sw;
        this.se = se;
    }
}

class Noise {
    constructor() {
        this.grid = [];
    }

    define_square(x0, y0, x1, y1) {
        if (this.grid[x0] === undefined) {
            this.grid[x0] = [];
        }
        if (this.grid[x1] === undefined) {
            this.grid[x1] = [];
        }
        if (this.grid[x0][y0] === undefined)
            this.grid[x0][y0] = new Vector(x0, y0);
        if (this.grid[x1][y0] === undefined)
            this.grid[x1][y0] = new Vector(x1, y0);
        if (this.grid[x0][y1] === undefined)
            this.grid[x0][y1] = new Vector(x0, y1);
        if (this.grid[x1][y1] === undefined)
            this.grid[x1][y1] = new Vector(x1, y1);
    }

    lerp(a0, a1, w) {
        return (1.0 - w)*a0 + w*a1;
    }

    dotGridGradient(ix, iy, x, y) {
        let dx = x - ix;
        let dy = y - iy;
        return (dx * this.grid[ix][iy].x + dy * this.grid[ix][iy].y);
    }

    perlin(x, y) {
        let x0 = Math.floor(x);
        let x1 = x0 + 1;
        let y0 = Math.floor(y);
        let y1 = y0 + 1;

        this.define_square(x0, y0, x1, y1);

        let sx = x - x0;
        let sy = y - y0;
        sx = sx * sx * (3 - 2 * sx);
        sy = sy * sy * (3 - 2 * sy);

        let n0, n1, ix0, ix1, value;

        n0 = this.dotGridGradient(x0, y0, x, y);
        n1 = this.dotGridGradient(x1, y0, x, y);
        ix0 = this.lerp(n0, n1, sx);
        n0 = this.dotGridGradient(x0, y1, x, y);
        n1 = this.dotGridGradient(x1, y1, x, y);
        ix1 = this.lerp(n0, n1, sx);
        value = this.lerp(ix0, ix1, sy);

        return value + 0.5;
    }
}

export default function Canva({R_size, G_size, B_size, props}) {

    const canvasRef = useRef(null)
    const noise_r = new Noise();
    const noise_g = new Noise();
    const noise_b = new Noise();

    const draw = (ctx) => {
        let height = ctx.canvas.height
        let width = ctx.canvas.width
        let imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.clearRect(0, 0, height, width)
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let index = (x + y * width) * 4;
                imageData.data[index + 0] = noise_r.perlin(x / R_size, y / R_size) * 255;
                imageData.data[index + 1] = noise_g.perlin(x / G_size, y / G_size) * 255;
                imageData.data[index + 2] = noise_b.perlin(x / B_size, y / B_size) * 255;
                imageData.data[index + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0)
    }

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        canvas.width = window.innerWidth * 0.5
        canvas.height = window.innerHeight * 0.5
        draw(context)
    }, [draw])

    return <canvas ref={canvasRef} {...props}/>
}
