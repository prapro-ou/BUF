//
//定数定義用
//

const MAP_WIDTH = 70; //マップの横幅
const MAP_HEIGHT = 40; //マップの縦幅
const TILE_SIZE = 66; //タイルのサイズ
const MAX_SPEED = 1;
const offset = {
        x:-521,
        y:-1210
    }
//キー入力の状態を管理するオブジェクト
const keys = {
    w:{
        pressed: false
    },
    a:{
        pressed: false
    },
    s:{
        pressed: false
    },
    d:{
        pressed: false
    }
}
function iscollide(boundary){
        return (boundary.loc.x < ((canvas.width>>1) + (Hero.width))&&
                boundary.loc.x + TILE_SIZE> ((canvas.width>>1))&&
                boundary.loc.y < ((canvas.height>>1) + (Hero.height))&&
                boundary.loc.y + TILE_SIZE > ((canvas.height>>1)))
    }//衝突しているかどうかs