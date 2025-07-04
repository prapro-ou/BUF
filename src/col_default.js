//
//通常ステージの衝突マップ子クラス
//
class col_default extends boudary {
    constructor({location}){
        super({location})
        this.loc = location
    }
    update(){}
    draw(){
        c.fillStyle = "rgba(0, 0, 0, 0.5)" //半透明の黒色
        //console.log('col_loc : ' + this.loc.x, this.loc.y);
        c.fillRect(
            this.loc.x ,
            this.loc.y,
            TILE_SIZE,
            TILE_SIZE,
        )
    }
}
