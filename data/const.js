//
//定数定義用
//

const MAP_WIDTH = 70; //マップの横幅
const MAP_HEIGHT = 40; //マップの縦幅
const TILE_SIZE = 48; //タイルのサイズ

//タイルの数を計算
const collision_width = MAP_WIDTH * TILE_SIZE; //衝突判定の横幅
const collision_height = MAP_HEIGHT * TILE_SIZE; //衝突判定の縦幅 
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