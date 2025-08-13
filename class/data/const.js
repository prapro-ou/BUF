//
//定数定義用
//
const MAP_WIDTH = 150; //マップの横幅
const MAP_HEIGHT = 150; //マップの縦幅
const TILE_SIZE = 32; //タイルのサイズ
const MAX_SPEED = 3; //最大移動速度
const HERO_W = 96; //ヒーローの横幅
const HERO_H = 96; //ヒーローの縦幅
const NPC_W = 32
const NPC_H = 64
const SQRT2 = Math.sqrt(2);
const offset = {
        x:-580,
        y:-2150 
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
    },
    e:{
        pressed: false
    },
    space:{
        pressed: false,
        wasPressed: false
    }
}

