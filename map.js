//
//map class
//
let fieldData = [
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 
1,2,3,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
];
class Field {
    constructor() {
        this.scx = 0; // カメラX（スクロール）
        this.scy = 0; // カメラY（今回は固定でOK）
    }

    update() {
        // カメラはプレイヤーに追従
        let px = Player.x >> 4;
        if (px > this.scx + 300) {
            this.scx = px - 300;
        } else if (px < this.scx + 90) {
            this.scx = px - 90;
        }

        // 画面端を超えないように制限
        const maxScrollX = (FIELD_SIZE_W * BLOCK_PIXEL) - SCREEN_SIZE_W;
        this.scx = Math.max(0, Math.min(this.scx, maxScrollX));
    }

    drawBlock(bl, px, py) {
        const sx = ((bl - 1) % TILE_COLS) * BLOCK_PIXEL;
        const sy = Math.floor((bl - 1) / TILE_COLS) * BLOCK_PIXEL;
        vcon.drawImage(RoadImg, sx, sy, BLOCK_PIXEL, BLOCK_PIXEL, px, py, BLOCK_PIXEL, BLOCK_PIXEL);
    }

    draw() {
        for (let y = 0; y < MAP_SIZE_H + 1; y++) {
            for (let x = 0; x < MAP_SIZE_W + 1; x++) {
                const mapX = x + Math.floor(this.scx / BLOCK_PIXEL);
                const mapY = y;
                const px = x * BLOCK_PIXEL - (this.scx % BLOCK_PIXEL);
                const py = y * BLOCK_PIXEL;

                const bl = fieldData[mapY * FIELD_SIZE_W + mapX];
                if (bl > 0) {
                    this.drawBlock(bl, px, py);
                }
            }
        }
    }
}