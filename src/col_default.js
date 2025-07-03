//
//通常ステージの衝突マップ子クラス
//
class col_default extends boudary {
    constructor({location}){
        super({location})
        this.loc = location
    }
    update(){
        this.frame++
        if(this.frame > 100000) this.frame = 0
    }
    draw(){
        c.fillStyle = "rgba(0, 0, 0, 0.4)" //半透明の黒色
        c.fillRect(
            this.loc.x ,
            this.loc.y,
            TILE_SIZE,
            TILE_SIZE,
        )
    }
}
