//
//定数定義用
//
const MAP_WIDTH = 70; //マップの横幅
const MAP_HEIGHT = 40; //マップの縦幅
const TILE_SIZE = 66; //タイルのサイズ
const MAX_SPEED = 8; //最大移動速度
const HERO_W = 48; //ヒーローの横幅
const HERO_H = 68; //ヒーローの縦幅
const SQRT2 = Math.sqrt(2);
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
    },
    tab:{
        pressed: false
    }
}

