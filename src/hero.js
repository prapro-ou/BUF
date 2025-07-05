//
//通常ステージの主人公子クラス
//
class hero extends human{
    constructor({location, image}){//位置 速さ 画像
        super({location, image})
        this.loc = location
        this.img = image 
        this.frame = 0
        this.is_stopping = true
        this.width = HERO_W
        this.height = HERO_H
    }
    update(){
        if(keys.w.pressed){
            this.img = playerImg_up
        }else if(keys.a.pressed){
            this.img = playerImg_left
        }else if(keys.s.pressed){
            this.img = playerImg_down
        }else if(keys.d.pressed){
            this.img = playerImg_right
        }else 
        this.img = playerImg_down
    }
    draw(){
        this.frame++
        if(this.frame > 100000) this.frame = 0;
        if(this.is_stopping){ 
        c.drawImage(
        this.img, 
        0,
        0,
        this.img.width>>2,
        this.img.height,
        //プレイヤーを画面の中心に
        (canvas.width>>1), 
        canvas.height>>1,
        this.img.width>>2,
        this.img.height
        ) 
        }
        else if(!this.is_stopping){
        c.drawImage(
        this.img, 
        48 * ((this.frame>>4)%4),
        0,
        this.img.width>>2,
        this.img.height,
        //プレイヤーを画面の中心に
        canvas.width>>1, 
        canvas.height>>1,
        this.img.width>>2,
        this.img.height
        ) 
        }
    }
}