//
//メインキャラクターのクラス
//
class player extends human{ 
    constructor(x, y){
        super(x, y); // ← これが最初に必要！一番最初に呼ぶことが絶対ルール
        this.x = x; //キャラクターの座標x
        this.y = y; //キャラクターの座標y
        this.vx = 0; //キャラクターの速度x
        this.vy = 0; //キャラクターの速度y
        this.stat = STOPING;//キャラクターがどういう状態か
        this.side = RIGHT; //キャラクターがどちら向きか
        this.sprite = 0; //何番目の画像を出力するか
        this.framecount = 0;//フレームカウント
        this.is_jumping = false;//キャラクターがジャンプしているかどうか
    }
UpdateJump() {
    // SPACE を押した瞬間だけジャンプ開始
    if (keyb.Jump && !this.is_jumping) {
        this.vy = -150;
        this.is_jumping = true;
    }
}
UpdateWalk(){
    if (keyb.Left === true && keyb.Right === false) { 
        if (this.vx >= -PLAYER_MAX_SPEED) this.vx -= PLAYER_AX; 
        this.side = LEFT;
        this.stat = WALKING
    } else if (keyb.Right === true && keyb.Left === false) {
        if (this.vx <= PLAYER_MAX_SPEED) this.vx += PLAYER_AX;
        this.side = RIGHT;
        this.stat = WALKING;
    } else {
        // vx の状態をカテゴリに分ける
        let state = (this.vx > 0) ? 1 : (this.vx < 0) ? 2 : 0;
        switch (state) {
            case 1:
                this.vx -= PLAYER_FRICTION;//キャラクターが右に進んでいるとき何もしないと定数比例で原則
                break;
            case 2:
                this.vx += PLAYER_FRICTION;//キャラクターが左に進んでいるとき何もしないと定数比例で原則
                break;
            case 0:
                // 何もしない（既に静止）
                this.stat = STOPING;
                this.vx = 0;
                break;
        }
        //描画ブレ防止のための丸め
        if (Math.abs(this.vx) < 10) {
        this.vx = 0;
        this.stat = STOPING;
        this.side = RIGHT;
        }

    }
    //世界のサイズ(block)を5bitシフトでピクセルサイズに演算は実座標の
    //5bitシフトなので計10bitシフト
    if (this.x > (FIELD_SIZE_W<<10)-(32<<5)) {
    this.vx = 0;
    this.x = (FIELD_SIZE_W<<10)-(32<<5);
    }
    if(this.x < 0) {
        this.vx = 0;//画面端で左に行けないようにする．
        this.x = 0;
    }
}
UpdateSprite(){//出力画像データの更新
    if(this.stat === STOPING) this.sprite = 0;//キャラが静止しているとき
    else if (this.stat === WALKING) {
        switch (this.side) { 
            case RIGHT : 
                    //フレームカウントの二桁右シフトしたときの割り算のあまりがサブセット
                    this.sprite = 0 + (this.framecount >> 3) % 3;
                    break;
            case LEFT : 
                    //フレームカウントの二桁右シフトしたときの割り算のあまりがサブセット
                    this.sprite = 0 + (this.framecount >> 3) % 3;
                    break;
        }
    }
}
CheckFloor(){//床の判定処理
    if(this.vy <= 0) return;
    let char_px = (this.x >> 5);//キャラクターのx座標pixel
    let char_py = ((this.y + this.vy) >> 5);//キャラクターのy座標pixel
    if(Map.isBlock(char_px+1,  char_py + 63) == 1|| 
        Map.isBlock(char_px+30, char_py + 63) == 1){// 仮床処理
            this.vy = 0;
            this.is_jumping = false;
            this.Jcount = 0;       
            this.y = ((((char_py + 63) >> 5) << 5) - 64) << 5;
    } else  this.is_jumping = true;
}
CheckWall(){//壁の判定処理
    let char_px = ((this.x + this.vx) >> 5);//キャラクターのx座標pixel
    let char_py = ((this.y + this.vy) >> 5);//キャラクターのy座標pixel
    //右側チェック
    if (Map.isBlock(char_px + 31, char_py + 8)  == 1||
        Map.isBlock(char_px + 31, char_py + 40) == 1||
        Map.isBlock(char_px + 31, char_py + 62) == 1) {
            this.vx = 0;
            this.x -= 16;
        }
    if (Map.isBlock(char_px, char_py + 8)  == 1||
        Map.isBlock(char_px, char_py + 30) == 1||
        Map.isBlock(char_px, char_py + 62) == 1){
            this.vx = 0;
            this.x += 16;
        }
}
CheckCeil(){//天井の判定処理
    if(this.vy >= 0) return;
    let char_px = (this.x >> 5);//キャラクターのx座標pixel
    let char_py = ((this.y + this.vy) >> 5);//キャラクターのy座標pixel
    if(Map.isBlock(char_px+30, char_py + 4) == 1||
       Map.isBlock(char_px+ 2, char_py + 4) == 1){
            this.vy = 0;
    }
}
//画像データのどこを画面に出力するか更新
draw(){
let px = ((this.x - (Map.scx << 5)) >> 5);
let py = ((this.y - (Map.scy << 5)) >> 5);
    drawSprite(this.sprite, px, py);
}
//update
update(){
    this.framecount++;
    this.UpdateWalk();
    this.UpdateSprite();
    this.UpdateJump();         
    this.CheckFloor();
    this.CheckWall();
    this.CheckCeil()
    super.Move();
    //仮落下処理
    if (this.y > ((288 + 32) << 5)) {
    this.x = 100<<5;
    this.y = (288-96)<<5;
}
}
}