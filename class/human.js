//
//人用親クラス
//

class human {
    constructor({location, image}){
        this.loc = location
        this.img = image 
        this.frame = 0
        this.is_stopping = true
        this.width = 0
        this.height = 0
    }
    update(){}
    draw(){}    
}