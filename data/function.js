//
//便利な関数保存用
//
function iscollide(boundary){
        return (boundary.loc.x < ((canvas.width>>1) + (HERO_W+2))&&
                boundary.loc.x + TILE_SIZE> ((canvas.width>>1))&&
                boundary.loc.y < ((canvas.height>>1) + (HERO_H+2))&&
                boundary.loc.y + (TILE_SIZE>>1) > ((canvas.height>>1)))
    }//衝突しているかどうか