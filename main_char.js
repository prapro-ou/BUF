//メインキャラクターのクラス
const MAX_SPEED = 32;
const RIGHT = 1;
const LEFT = 0;
const STOPING = 0;
const WALKING = 1;
const CHARACTER_AX = 1//キャラクターの移動加速度
const CHARACTER_FRICTION = 1;//キャラクターの摩擦
const NUMBER_OF_CHAR_FRAME = 4;
class MainCharacter{
    constructor(x, y){
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
UpdateJump(){
     //ジャンピング
     //TODOキャラクターが空中にいるときはジャンプできないようにする
        if (keyb.Jump) {
            if(!this.is_jumping){//キャラクターがジャンプしていないとき
            this.is_jumping = true;
            this.Jcount = 0;
            }
            if(this.Jcount <= 16) {//何フレームまで上へ加速させるか
                this.vy = -(64 - this.Jcount);
            } 
            this.Jcount++;
        } else {
        this.is_jumping = false; // ← キーを離したときにジャンプ解除
    }
}
UpdateWalk(){
    if (keyb.Left === true && keyb.Right === false) { 
        if (this.vx >= -MAX_SPEED) this.vx -= CHARACTER_AX; 
        this.side = LEFT;
        this.stat = WALKING
    } else if (keyb.Right === true && keyb.Left === false) {
        if (this.vx <= MAX_SPEED) this.vx += CHARACTER_AX;
        this.side = RIGHT;
        this.stat = WALKING;
    } else {
        // vx の状態をカテゴリに分ける
        let state = (this.vx > 0) ? 1 : (this.vx < 0) ? 2 : 0;
        switch (state) {
            case 1:
                this.vx -= CHARACTER_FRICTION;
                break;
            case 2:
                this.vx += CHARACTER_FRICTION;
                break;
            case 0:
                // 何もしない（既に静止）
                this.stat = STOPING;
                break;
        } 
    }
    this.x += this.vx;//座標更新
    if(this.x < 0) this.x = 0;//画面端で左に行けないようにする．
    //TODO右端も作る
    this.y += this.vy;//座標更新
}
UpdateSpring(){//出力画像データの更新
    if(this.stat === STOPING) this.sprite = 0;//キャラが静止しているとき
    else if (this.stat === WALKING) {
        switch (this.side) { 
            case RIGHT : 
                    //フレームカウントの二桁右シフトしたときの割り算のあまりがサブセット
                    this.sprite = 1 + (this.framecount >> 2) % NUMBER_OF_CHAR_FRAME;
                    break;
            case LEFT : 
                    //フレームカウントの二桁右シフトしたときの割り算のあまりがサブセット
                    this.sprite = 5 + (this.framecount >> 2) % NUMBER_OF_CHAR_FRAME;
                    break;
        }
    }
}

//画像データのどこを画面に出力するか更新
draw(){
    let px = (this.x>>4) - Map.scx;
    let py = (this.y>>4) - Map.scy;
    drawSprite(this.sprite, px, py);
}
//update
update(){
    this.framecount++;
    if(this.vy <= 64) this.vy += GRAVITY;
    if(this.y >180 <<4){// 仮床処理
            this.vy = 0;
            this.is_jumping = false;
            this.y =180 << 4;
            this.Jcount = 0;
        }
    this.UpdateJump();
    this.UpdateWalk();
    this.UpdateSpring();
}
}