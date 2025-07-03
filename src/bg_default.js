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
        test_boundary.loc.y+=3
        this.loc.y+=3
        Hero.loc.y+=3
        }
        if(keys.a.pressed){
        test_boundary.loc.x+=3    
        this.loc.x+=3
        Hero.loc.x+=3
        }
        if(keys.s.pressed){
        test_boundary.loc.y -=3
        this.loc.y-=3
        Hero.loc.y-=3
        }
        if(keys.d.pressed){
        test_boundary.loc.x-=3
        this.loc.x-=3
        Hero.loc.x-=3
        }
    }w
    draw(){
        c.drawImage(image, this.loc.x, this.loc.y) //プレイヤー初期画面
    }
}