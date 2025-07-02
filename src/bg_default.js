//
//通常ステージの背景子クラス
//
class bg_default extends background{
    constructor({location, velocity, image}){//位置 速さ 画像
        super({location, velocity, image})
        this.loc = location
        this.img = image 
    }
    update(){
        if(keys.w.pressed){
        this.loc.y++
        }
        if(keys.a.pressed){
        this.loc.x++
        }
        if(keys.s.pressed){
        this.loc.y--
        }
        if(keys.d.pressed){
        this.loc.x--
        }
    }w
    draw(){
        c.drawImage(image, this.loc.x, this.loc.y) //プレイヤー初期画面
    }
}