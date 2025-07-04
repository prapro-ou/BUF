//
//通常ステージの背景子クラス
//
class bg_default extends ground{
    constructor({location, velocity, image}){//位置 速さ 画像
        super({location, velocity, image})
        this.loc = location
        this.img = new Image()
        this.img.src = bgImage.src 
    }

    update(){
        //上キーが押されたとき
        if(keys.w.pressed){
        let mobable = true
        //衝突判定
        for(let i = 0; i < boudaries.length; i++){ 
            const boundary = boudaries[i];
            if (iscollide({boundary, loc:{
                x:boundary.loc.x, 
                y:boundary.loc.y + MAX_SPEED
                }
                })) {
                console.log('衝突してるよ');
                mobable = false
            }
        }
        if(mobable){
        boudaries.forEach(boundary => {
            boundary.loc.y+=MAX_SPEED
        })
        //位置を更新
        Foreground.loc.y+=MAX_SPEED
        this.loc.y+=MAX_SPEED
        Hero.loc.y+=MAX_SPEED
        }
        }

        //左キーが押されたとき
        if(keys.a.pressed){
        let mobable = true
        for(let i = 0; i < boudaries.length; i++){ 
            const boundary = boudaries[i];
            if (iscollide({boundary, loc:{   
                    x:boundary.loc.x + MAX_SPEED, 
                    y:boundary.loc.y
                }
                })) {
                console.log('衝突してるよ');
                mobable = false
            }
        }
        if(mobable){
        boudaries.forEach(boundary => {
            boundary.loc.x+=MAX_SPEED
        })
        Foreground.loc.x+=MAX_SPEED
        this.loc.x+=MAX_SPEED
        Hero.loc.x+=MAX_SPEED
        }
        }
        //下キーが押されたとき
        if(keys.s.pressed){
        let mobable = true
        for(let i = 0; i < boudaries.length; i++){ 
            const boundary = boudaries[i];
            if (iscollide({boundary, loc:{
                x:boundary.loc.x, 
                y:boundary.loc.y - MAX_SPEED
            }
            })) {
                console.log('衝突してるよ');
                mobable = false
            }
        }
        if(mobable){
            boudaries.forEach(boundary => {
            boundary.loc.y-=MAX_SPEED
        })
        Foreground.loc.y-=MAX_SPEED
        this.loc.y-=MAX_SPEED
        Hero.loc.y-=MAX_SPEED
        }
        }
        //右キーが押されたとき   
        if(keys.d.pressed){
        let mobable = true
        for(let i = 0; i < boudaries.length; i++){ 
            const boundary = boudaries[i];
            if (iscollide({boundary, loc:{
                x:boundary.loc.x - MAX_SPEED, 
                y:boundary.loc.y
                }
                })) {
                console.log('衝突してるよ');
                mobable = false
            }
        }
        if(mobable){
        boudaries.forEach(boundary => {
            boundary.loc.x-=MAX_SPEED
        })
        Foreground.loc.x-=MAX_SPEED
        this.loc.x-=MAX_SPEED
        Hero.loc.x-=MAX_SPEED
        }
    }
    }
    draw(){
        c.drawImage(this.img, this.loc.x, this.loc.y) //プレイヤー初期画面
    }
}