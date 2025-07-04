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
        test_boundary.loc.y+=MAX_SPEED
        this.loc.y+=MAX_SPEED
        Hero.loc.y+=MAX_SPEED
        }
        if(keys.a.pressed){
        test_boundary.loc.x+=MAX_SPEED    
        this.loc.x+=MAX_SPEED
        Hero.loc.x-=MAX_SPEED
        }
        if(keys.s.pressed){
        test_boundary.loc.y -=MAX_SPEED
        this.loc.y-=MAX_SPEED
        Hero.loc.y-=MAX_SPEED
        }
        if(keys.d.pressed){
        test_boundary.loc.x-=MAX_SPEED
        this.loc.x-=MAX_SPEED
        Hero.loc.x+=MAX_SPEED
        }
    }
    draw(){
        c.drawImage(image, this.loc.x, this.loc.y) //プレイヤー初期画面
    }
}