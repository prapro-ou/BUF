//
//通常ステージの背景子クラス
//
class bg_default extends ground{
    constructor({location, velocity, image}){//位置 速さ 画像
        super({location, velocity, image})
        this.loc = location
        this.velocity = {
            x: 0,
            y: 0
        }
        this.img = new Image()
        this.img.src = bgImage.src
        this.movable = true
    }
    move(){
            boudaries.forEach(boundary => {
                boundary.loc.x+=this.velocity.x
            })
            Foreground.loc.x+=this.velocity.x
            this.loc.x+=this.velocity.x
            Hero.loc.x+=this.velocity.x

            boudaries.forEach(boundary => {
                boundary.loc.y+=this.velocity.y
            })
            Foreground.loc.y+=this.velocity.y
            this.loc.y+=this.velocity.y
            Hero.loc.y+=this.velocity.y
        
    }
    check_collide(vx, vy){
        //衝突判定
        for(let i = 0; i < boudaries.length; i++){ 
            const boundary = boudaries[i];
            if (iscollide({boundary, loc:{
                x:boundary.loc.x + vx, 
                y:boundary.loc.y + vy
                }
                })) {
                console.log('衝突してるよ');
                return false
            }
        }
        return true
    }
    update_move(){
        this.velocity.x=0
        this.velocity.y=0
        //上キーが押されたとき
        if(keys.w.pressed){
        this.movable = this.check_collide(0, MAX_SPEED)
        this.velocity.y += MAX_SPEED
        }

        //左キーが押されたとき
        if(keys.a.pressed){
        this.movable = this.check_collide(MAX_SPEED, 0)
        this.velocity.x += MAX_SPEED
        }

        //下キーが押されたとき
        if(keys.s.pressed){
        this.movable = this.check_collide(0, -MAX_SPEED)
        this.velocity.y -= MAX_SPEED
        }

        //右キーが押されたとき   
        if(keys.d.pressed){
        this.movable = this.check_collide(-MAX_SPEED, 0)
            this.velocity.x -= MAX_SPEED
        }

        if(this.velocity.x != 0&&this.velocity.y != 0) {
            let a = Math.sqrt(2)
            console.log(a)
            this.velocity.x /= a
            this.velocity.y /= a
        }
    
}
    update(){
        this.update_move()
        if(this.movable)this.move()
    }
    draw(){
        c.drawImage(this.img, this.loc.x, this.loc.y) //プレイヤー初期画面
    }
}