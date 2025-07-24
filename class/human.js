//
//人用親クラス
//

class human {
    constructor({location, image}){
        this.loc = location
        this.img = new Image()
        this.img_num = 0
        this.frame = 0
        this.is_stopping = true
        this.width = HERO_W
        this.height = HERO_H
        this.inv = new inventory()
    }
    update(){}
    draw(){}    
}