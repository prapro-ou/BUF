//メインキャラクターのクラス
const MAX_SPEED = 32;
const RIGHT = 1;
const LEFT = 0;
const STOPING = 0;
const WALKING = 1;
class MainCharacter{
    constructor(x, y){
        this.x = x; //キャラクターの座標x
        this.y = y; //キャラクターの座標y
        this.vx = 0; //キャラクターの速度
        this.vy = 0;
        this.stat = STOPING;//キャラクターがどういう状態か
        this.side = RIGHT; //キャラクターがどちら向きか
        this.sprite = 0;
        this.framecount = 0;
        this.is_jumping = false;
    }
UpdateWalk(){
    if (keyb.Left === true && keyb.Right === false) { 
        if (this.vx >= -MAX_SPEED) this.vx -= 1; 
        this.side = LEFT;
        this.stat = WALKING
    } else if (keyb.Right === true && keyb.Left === false) {
        if (this.vx <= MAX_SPEED) this.vx += 1;
        this.side = RIGHT;
        this.stat = WALKING;
    } else {
        // vx の状態をカテゴリに分ける
        let state = (this.vx > 0) ? 1 : (this.vx < 0) ? 2 : 0;
        switch (state) {
            case 1:
                this.vx -= 1;
                break;
            case 2:
                this.vx += 1;
                break;
            case 0:
                // 何もしない（既に静止）
                this.stat = STOPING;
                break;
        }
    }
    this.x += this.vx;
    this.y += this.vy;
}
UpdateSpring(){
    if(this.stat === STOPING) this.sprite = 0;//キャラが静止しているとき
    else if (this.stat === WALKING) {
        switch (this.side) { 
            case RIGHT : 
                    this.sprite = 1 + (this.framecount >> 2) % 4;
                    break;
            case LEFT : 
                    this.sprite = 5 + (this.framecount >> 2) % 4;
                    break;
        }
    }
}
UpdateJump(){
     //ジャンピング
        if (keyb.Jump) {
            if(!this.is_jumping){
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
//画像データのどこを画面に出力するか更新
draw(){
    drawSprite(this.sprite, this.x, this.y);
}
//update
update(){
    this.framecount++;
    if(this.vy <= 64) this.vy += GRAVITY;
    if(this.y >210 <<4){// 仮床処理
            this.vy = 0;
            this.is_jumping = false;
            this.y = 210 << 4;
            this.Jcount = 0;
        }
    this.UpdateJump();
    this.UpdateWalk();
    this.UpdateSpring();
}
}