//
//定数定義用
//

const MAP_WIDTH = 70; //マップの横幅
const MAP_HEIGHT = 40; //マップの縦幅
const TILE_SIZE = 66; //タイルのサイズ

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