//
//map class
// 
//
class Field {
    constructor() {
        this.scxRaw = 0; // 5ビット固定小数点のスクロール値（単位: 1/32 px）
        this.scx = 0;     // 描画用の整数ピクセル値（整数px）
    }
    update() {
        // プレイヤー座標も 5bit 固定小数（1/32単位）を前提
        const playerFixed = Player.x; // すでに fixed(<<5) 形式

        // スクリーン中心（固定小数として計算）
        const screenCenter = (SCREEN_SIZE_W >> 1) << 5;

        // スクロール目標位置（固定小数）
        const targetScx = playerFixed - screenCenter;

        // 線形補間（固定小数点演算）
        this.scxRaw += ((targetScx - this.scxRaw) >> 2); // → 0.25相当

        // 描画時に必要な整数スクロール値
        let scrollOffsetPx = this.scxRaw >> 5;

        // 制限：マップ右端を超えないように調整
        const maxScroll = ((FIELD_SIZE_W * BLOCK_PIXEL) - SCREEN_SIZE_W);
        scrollOffsetPx = Math.max(0, Math.min(scrollOffsetPx, maxScroll));

        // 描画時に使うスクロール値（整数px）
        this.scx = scrollOffsetPx;

        // （必要に応じて this.scxRaw も clamp しておくと安定）
        const scxRawMax = (maxScroll << 5);
        this.scxRaw = Math.max(0, Math.min(this.scxRaw, scxRawMax));
    }

    isBlock(x, y){
        let bl= fieldData2[(y >> 5) * FIELD_SIZE_W + (x >> 5)];
        if (bl <= 0) return 0;
        switch (Bl_type[bl - 1]) {
            case 0 : return 0;
            case 1 : return 1;
        }          
    }

    drawBlock(bl, px, py) {

        if(bl <= 4) {
            let sx = ((bl - 1) & (TILE_COLS-1)) << 5;
            let sy = Math.floor((bl - 1) >> 4) << 5;            
            vcon.drawImage(RoadImg, sx, sy, BLOCK_PIXEL, BLOCK_PIXEL, px, py, BLOCK_PIXEL, BLOCK_PIXEL);
        } else if(bl == 37) {
                let sx = 0;
                let sy = 0;            
                vcon.drawImage(KonbiniImg, sx, sy, 320, 320, px, py, 320, 320);
        }
    }

    draw() {
        for (let y = 0; y < FIELD_SIZE_W+1; y++) {
            for (let x = 0; x < FIELD_SIZE_W+1; x++) {
                const mapX = x + (this.scx >> 5);//表示する画面の各ブロックにアクセス
                                                // scxはピクセル座標なのでブロック座標に=÷32
                const mapY = y;//yのカメラ座標は縦スクロールがないのでそのまま
                const px = (x << 5) - (this.scx & (BLOCK_PIXEL-1));//表示するブロックのピクセル座標を計算
                const py = (y << 5);

                const bl = fieldData2[mapY * FIELD_SIZE_W + mapX];//表示するブロックのスプライト番号を取得
                if (bl > 0) {
                    this.drawBlock(bl, px, py);
                }
            }
        }
    }
}