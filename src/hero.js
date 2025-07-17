//
//通常ステージの主人公子クラス
//
class hero extends human{
    constructor({location, image}){//位置 速さ 画像
        super({location, image})
        this.loc = location
        this.img = new Image()
        this.img_num = 0
        this.frame = 0
        this.is_stopping = true
        this.inv = new inventory()
        this.is_talking = false
    }
    update_state(){
        if(Background.velocity.x !== 0 || Background.velocity.y !== 0){
            this.is_stopping = false
        }else{
            this.is_stopping = true
        }
        if(keys.tab.pressed){
            keys.tab.pressed = false
            this.inv.inventoryVisible = !this.inv.inventoryVisible        }
    }
    update_image(){
        if(this.is_stopping){
            this.img_num = 0
            this.img.src = playerImg_down.src
        }
        else if(!this.is_stopping){
            this.img_num = (this.frame>>4)%2 + 1//フレーム数を4で割った余りを2で割ることで0,1,のいずれかを取得
            //プレイヤーの向きに応じて画像を切り替える
            if(Background.velocity.x < 0){
                this.img.src = playerImg_right.src
            }
            else if(Background.velocity.x > 0){
                this.img.src = playerImg_left.src
            }   
            else if(Background.velocity.y > 0){
                this.img.src = playerImg_up.src
            }
            else if(Background.velocity.y < 0){
                this.img.src = playerImg_down.src
            }
        }
    }
    update(){
        this.frame++
        if(this.frame > 1000000) this.frame = 0;
        this.update_state()
        this.update_image()
        this.inv.updateInventoryUI()
        this.inv.display() //持ち物を表示
    }
    draw(){
        c.drawImage(
        this.img, 
        96 * this.img_num, //画像の切り取り位置
        0,
        96,//画像の切り取り幅
        96,//画像の切り取り高さ

        //プレイヤーを画面の中心に
        canvas.width>>1, 
        canvas.height>>1,
        HERO_W, //プレイヤーの横幅
        HERO_H //プレイヤーの縦幅
        ) 
    }
}