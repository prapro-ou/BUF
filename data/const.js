//
//定数定義用
//
const MAP_WIDTH = 70; //マップの横幅
const MAP_HEIGHT = 40; //マップの縦幅
const TILE_SIZE = 64; //タイルのサイズ
const MAX_SPEED = 0.5; //最大移動速度
const HERO_W = 96; //ヒーローの横幅
const HERO_H = 96; //ヒーローの縦幅
const SQRT2 = Math.sqrt(2);
const offset = {
        x:-600,
        y:-2500
    }
// const canvas_heroloc = {loc: {
//         x: 512,
//         y: 288
//     }
    

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
    },
    e:{
        pressed: false
    }
}

