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
    // プレイヤーのピクセル位置（this.x は 32倍で保持されている前提）
    let playerPixelX = Player.x >> 5;

    // スクロールターゲット（プレイヤーを画面中央付近にしたい場合）
    let targetScx = playerPixelX - (SCREEN_SIZE_W / 2);

    // スクロールはリニア補間で滑らかに追従（サブピクセルまで保持）
    this.scx += (targetScx - this.scx) * 0.2;

    // 表示用に整数へ丸めてブレを防止（描画処理でも floor 必須）
    let scrollOffset = Math.floor(this.scx);

    // 画面端を超えないように制限
    const maxScrollX = (FIELD_SIZE_W * BLOCK_PIXEL) - SCREEN_SIZE_W;
    scrollOffset = Math.max(0, Math.min(scrollOffset, maxScrollX));

    // 丸めたスクロール座標を反映（描画時はこの値を参照）
    this.scx = scrollOffset;
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
        for (let y = 0; y < SC_BLOCK_H + 1; y++) {
            for (let x = 0; x < SC_BLOCK_W + 1; x++) {
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