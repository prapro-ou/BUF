//
//通常ステージの衝突マップ子クラス
//
class kusa_default extends boudary {
    constructor({location}){
        super({location})
        this.img = new Image()
        this.img.src = nobirukusa.src
        this.frame = 0
        this.loc = location
        this.state = 0
    }
    update(deltaTime){
    // 1秒間に3フレーム進む（ゆっくり）
    this.frame += (deltaTime / 1000) * 3;

    if(this.frame > 100000) this.frame = 0;
}


    draw(){
    let currentFrame = (Math.floor(this.frame) % 3);
    if(this.state == 1) currentFrame = 0;
    c.drawImage(
        this.img, 
        32 * currentFrame, 0,
        32, 32,
        this.loc.x, this.loc.y,
        96, 96
    ); 
}


}
