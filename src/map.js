//
//map class
// 
//
class Field {
    constructor() {
        this.scx = 0; // カメラX（スクロール）
        this.scy = 0; // カメラY（今回は固定でOK）
    }

    update() {
        // カメラはプレイヤーに追従
        let px = Player.x >> 5;
        if (px > this.scx + 300) {
            this.scx = px - 300;
        } else if (px < this.scx + 90) {
            this.scx = px - 90;
        }

        // 画面端を超えないように制限
        const maxScrollX = (FIELD_SIZE_W * BLOCK_PIXEL) - SCREEN_SIZE_W;
        this.scx = Math.max(0, Math.min(this.scx, maxScrollX));
    }
    
    isBlock(x, y){
        let bl= fieldData[(y >> 5) * FIELD_SIZE_W + (x >> 5)];
        if (bl <= 0) return -1;
        switch (Bl_type[bl - 1]) {
            case 0 : return 0;
            case 1 : return 1;
        }          
    }

    drawBlock(bl, px, py) {
        const sx = ((bl - 1) & (TILE_COLS-1)) << 5;
        const sy = Math.floor((bl - 1) >> 4) << 5;
        vcon.drawImage(RoadImg, sx, sy, BLOCK_PIXEL, BLOCK_PIXEL, px, py, BLOCK_PIXEL, BLOCK_PIXEL);
    }

    draw() {
        for (let y = 0; y < SC_BLOCK_H + 1; y++) {
            for (let x = 0; x < SC_BLOCK_W + 1; x++) {
                const mapX = x + (this.scx >> 5);//表示する画面の各ブロックにアクセス
                                                // scxはピクセル座標なのでブロック座標に=÷32
                const mapY = y;//yのカメラ座標は縦スクロールがないのでそのまま
                const px = (x << 5) - (this.scx & (BLOCK_PIXEL-1));//表示するブロックのピクセル座標を計算
                const py = (y << 5);

                const bl = fieldData[mapY * FIELD_SIZE_W + mapX];//表示するブロックのスプライト番号を取得
                if (bl > 0) {
                    this.drawBlock(bl, px, py);
                }
            }
        }
    }
}