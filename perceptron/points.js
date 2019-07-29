class Point {
    constructor() {
        this.x = random(-1, 1);
        this.y = random(-1, 1);

        this.tag = this.y > f(this.x) ? 1 : -1;
        this.bias = 1;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
        this.tag = this.y > f(this.x) ? 1 : -1;
    }

    setPixelPos(x, y) {
        this.x = this.cartesianX(x);
        this.y = this.cartesianY(y);
        this.tag = this.y > f(this.x) ? 1 : -1;
    }

    show() {
        stroke(0);
        if (this.tag == 1)
            fill(255);
        else
            fill(0);

        ellipse(this.pixelX(), this.pixelY(), 10, 10);
    }

    pixelX() {
        return map(this.x, -1, 1, 0, width);
    }

    pixelY() {
        return map(this.y, -1, 1, height, 0);
    }

    cartesianX(pixelX) {
        return map(pixelX, 0, width, -1, 1);
    }

    cartesianY(pixelY) {
        return map(pixelY, height, 0, -1, 1);
    }
}