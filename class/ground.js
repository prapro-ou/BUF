//
//背景のためのクラス
//

class ground{
    constructor({location, velocity, image}){//位置 速さ 画像
        this.loc = location
        this.img = image 
    }
    update () {} 
    draw () {
        c.drawImage(image, this.loc.x, this.loc.y) //プレイヤー初期画面
    }
}