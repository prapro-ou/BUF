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
        //移動する
            //X座標の更新
            boundaries.forEach(boundary => {
                boundary.loc.x+=this.velocity.x
            })
            //背景のX座標を更新
            Foreground.loc.x+=this.velocity.x
            this.loc.x+=this.velocity.x
            //NPCのX座標を更新
            entities.forEach(npc => {
                npc.loc.x+=this.velocity.x
            })
            //HeroのX座標を更新
            Hero.loc.x-=this.velocity.x

            //Y座標の更新
            //背景のY座標を更新
            boundaries.forEach(boundary => {
                boundary.loc.y+=this.velocity.y
            })
            Foreground.loc.y+=this.velocity.y
            this.loc.y+=this.velocity.y
            //NPCのY座標を更新
            entities.forEach(npc => {
                npc.loc.y+=this.velocity.y
            })
            //HeroのY座標を更新
            Hero.loc.y-=this.velocity.y
    }
    check_collide(vx, vy){
        //衝突判定
        for(let i = 0; i < boundaries.length; i++){ 
            const boundary = boundaries[i];
            if (iscollide({boundary, loc:{
                x:boundary.loc.x + vx, 
                y:boundary.loc.y + vy
                }
                })) {
                
                Hero.inv.addItem({
                name: '衝突',
                count: 1,
                description: '衝突してるよ'
                })
                
                return false
            }
        }
        return true
    }
    update_move() {
        let nextX = 0;  
        let nextY = 0;

        if (keys.w.pressed) nextY += MAX_SPEED;
        if (keys.s.pressed) nextY -= MAX_SPEED;
        if (keys.a.pressed) nextX += MAX_SPEED;
        if (keys.d.pressed) nextX -= MAX_SPEED;

        // 斜め移動の速度補正
        if (nextX !== 0 && nextY !== 0) {
            
            nextX /= SQRT2;
            nextY /= SQRT2;
        }

        // まず斜めの衝突をチェック
        if (this.check_collide(nextX, nextY)) {
            this.velocity.x = nextX;
            this.velocity.y = nextY;
        } 
        // 斜めでダメなら個別に軸ごとにチェック
        else if (this.check_collide(nextX, 0)) {
            this.velocity.x = nextX;
            this.velocity.y = 0;
        } 
        else if (this.check_collide(0, nextY)) {
            this.velocity.x = 0;
            this.velocity.y = nextY;
        } 
        else {
            this.velocity.x = 0;
            this.velocity.y = 0;
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