//
//便利な関数保存用
//
function iscollide(boundary){
        return (boundary.loc.x < ((canvas.width>>1) + (Hero.width))&&
                boundary.loc.x + TILE_SIZE> ((canvas.width>>1))&&
                boundary.loc.y < ((canvas.height>>1) + (Hero.height))&&
                boundary.loc.y + (TILE_SIZE>>1) > ((canvas.height>>1)))
    }//衝突しているかどうか