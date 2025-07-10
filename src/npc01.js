//
//npc用のクラス
//

class npc01 extends human {
    constructor({location, image}){
        super({location, image})
        this.loc = location
        this.img = new Image()
        this.img.src = playerImg_down.src
    }
    draw(){
        c.drawImage(
        this.img, 
        0, //画像の切り取り位置
        0,
        HERO_W,//画像の切り取り幅
        HERO_H,//画像の切り取り高さ

        //プレイヤーを画面の中心に
        -(this.loc.x - offset.x), 
        -(this.loc.y - offset.y), //画面の中心からの位置
        HERO_W, //プレイヤーの横幅
        HERO_H //プレイヤーの縦幅
        ) 
    }

}