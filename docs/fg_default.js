//
//通常ステージの前背景子クラス
//
class fg_default extends ground{
    constructor({location, velocity, image}){//位置 速さ 画像
        super({location, velocity, image})
        this.loc = location
        this.img = new Image()
        this.img.src = fgImage.src
    }

update(){}
draw(){
        c.drawImage(fgImage, this.loc.x, this.loc.y) //プレイヤー初期画面
}
}