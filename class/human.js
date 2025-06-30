//
//人の親クラス
//
class human{
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

//横移動の仕方
UpdateWalk() {}
//ジャンプ
UpdateJump() {}
//描画フレーム更新
UpdateSpring() {}
//床当たり判定チェック
CheckFloor() {} 
//壁当たり判定チェック
CheckWall() {}
//天井当たり判定チェック
CheckCeil() {} 
//重力適応座標更新
Move() {
    if(this.vy <= 128) this.vy += GRAVITY;
    this.y += this.vy;//座標更新
    this.x += this.vx;//座標更新
}
//画像データのどこを画面に出力するか更新
draw() {
    let px = (this.x>>5) - Map.scx;
    let py = (this.y>>5) - Map.scy;
    drawSprite(this.sprite, px, py);
}
//update
update() {}
}