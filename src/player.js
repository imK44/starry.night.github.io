export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isLeft = false;
        this.isRight = false;
        this.isFalling = false;
        this.isPlummeting = false;
        this.isJump = false;
    }
}
