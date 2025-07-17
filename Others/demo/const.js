//定数定義用のファイル
const SCREEN_SIZE_W = 512; // 32x16
const SCREEN_SIZE_H = 288; // 32x9
//一画面当たりのブロック数
const SC_BLOCK_W = 16;
const SC_BLOCK_H = 9;
//マップデータのブロック数
const FIELD_SIZE_W = 32;
const FIELD_SIZE_H = 9;

const GAME_FPS = 1000 / 60;// Game fps
const BLOCK_PIXEL = 32;//１ブロックの辺のピクセル数
const TILE_COLS = 16;//横に何フレーム連続で画像データが作られているのか

const DEFAULT_STAGE = 0;//通常ステージ

//エンティティの定数群
const RIGHT = 1;
const LEFT = 0;
const STOPING = 0;
const WALKING = 1;
const MAX_SPEED = 3; //最大速度