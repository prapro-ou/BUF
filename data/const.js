//
//定数定義用
//
const MAP_WIDTH = 80; //マップの横幅
const MAP_HEIGHT = 80; //マップの縦幅
const TILE_SIZE = 96; //タイルのサイズ
const MAX_SPEED = 4; //最大移動速度
const HERO_W = 96; //ヒーローの横幅
const HERO_H = 96; //ヒーローの縦幅
const NPC_W = 32
const NPC_H = 32
const SQRT2 = Math.sqrt(2);
const offset = {
        x:-580,
        y:-2150 
    }    

//キー入力の状態を管理するオブジェクト
const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
  e: { pressed: false, wasPressed: false },
  tab: { pressed: false },
  space: { pressed: false }
};

const shopItems = [
  {
    name: "砂時計",
    price: 500,
    zaiko: 1000,
    description: "プログラミング制限時間を延長",
    onBuy: () => {
      Hero.inv.addItem({ name: "砂時計", count: 1, description: "プログラミング制限時間を延長" });
    }
  }
];

