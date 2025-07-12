//
//npc用のクラス
//

class npc01 extends human {
    constructor({namae, location, image}){
        super({location, image})
        this.name = namae
        this.loc = location
        this.img = new Image()
        this.img.src = playerImg_down.src
        this.is_nearest = false
        this.state = 0
    }
    can_talk(){
        console.log("近い？" + this.is_nearest)
        if(!this.is_nearest) return false
        let dis = distance(this.loc, Hero.loc) 
        console.log(this.name + ' : '+ dis)
        if(dis < 64) return true; else return false
    }
    talk(){
        console.log('Hello')
    }
    draw(){
        c.drawImage(
        this.img, 
        0, //画像の切り取り位置
        0,
        HERO_W,//画像の切り取り幅
        HERO_H,//画像の切り取り高さ

        //プレイヤーを画面の中心に
        this.loc.x, 
        this.loc.y, //画面の中心からの位置
        HERO_W, //プレイヤーの横幅
        HERO_H //プレイヤーの縦幅
        ) 
    }

}