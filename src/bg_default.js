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
        this.totalOffset = {
            x: 0,
            y: 0
        };
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
            npcs.forEach(npc => {
                npc.loc.x+=this.velocity.x
            })
            shops.forEach(shop => {
                shop.loc.x+=this.velocity.x
            })
            kusas.forEach(shop => {
                shop.loc.x+=this.velocity.x
            }) 
            // Bridge.loc.x+=this.velocity.x
            
            //Y座標の更新
            //背景のY座標を更新
            boundaries.forEach(boundary => {
                boundary.loc.y+=this.velocity.y
            })
            Foreground.loc.y+=this.velocity.y
            this.loc.y+=this.velocity.y
            //NPCのY座標を更新
            npcs.forEach(npc => {
                npc.loc.y+=this.velocity.y
            })
            shops.forEach(shop => {
                shop.loc.y+=this.velocity.y
            })
            kusas.forEach(shop => {
                shop.loc.y+=this.velocity.y
            }) 
            // Bridge.loc.y+=this.velocity.y

            this.totalOffset.x += this.velocity.x;
            this.totalOffset.y += this.velocity.y;
    }
    check_collide(vx, vy){         
        //衝突判定
        for(let i = 0; i < boundaries.length; i++){ 
            const boundary = boundaries[i];
            if (iscollide({boundary, loc:{
                    x:boundary.loc.x + vx, 
                    y:boundary.loc.y + vy
                }})) {
                
                return false
            }
        }
        return true
    }
update_move(deltaTime) {
    let nextX = 0;  
    let nextY = 0;

    const speed = MAX_SPEED * (deltaTime / 1000); // 秒単位の速度

    if (keys.w.pressed) nextY += speed;
    if (keys.s.pressed) nextY -= speed;
    if (keys.a.pressed) nextX += speed;
    if (keys.d.pressed) nextX -= speed;

    // 斜め移動の速度補正
    if (nextX !== 0 && nextY !== 0) {
        nextX /= SQRT2;
        nextY /= SQRT2;
    }

    // キー入力があるときだけ衝突判定
    if (nextX !== 0 || nextY !== 0) {
        if (this.check_collide(nextX, nextY)) {
            this.velocity.x = nextX;
            this.velocity.y = nextY;
        } 
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
    } else {
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
}


    update(deltaTime){
    this.movable = true
    this.update_move(deltaTime)
    if(this.movable) this.move()
}

    draw(){
        c.drawImage(this.img, this.loc.x, this.loc.y) //プレイヤー初期画面
    }
}