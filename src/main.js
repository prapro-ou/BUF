//仮想キャンバス宣言
let vcan = document.createElement("canvas");
let vcon = vcan.getContext("2d");

//実態キャンバス宣言
let can = document.getElementById("can");//描画領域適宜
let con = can.getContext("2d");//どう描くかを制御 

//仮想キャンバスサイズ宣言
vcan.width = SCREEN_SIZE_W;//仮想画面のサイズ横定義
vcan.height = SCREEN_SIZE_H;//仮想画面のサイズ縦定義

//実態キャンバスサイズ宣言
can.width = SCREEN_SIZE_W*3;//実画面のサイズ横定義
can.height = SCREEN_SIZE_H*3;//実画面のサイズ縦定義

//描画のぼやぼやをなくすメソッド
con.mozimageSmoothingEnabled = false;
con.msimageSmoothingEnabled = false;
con.webkitimageSmoothingEnabled = false;
con.imageSmoothingEnabled = false;

//キャラクター表示
let chImg = new Image(); //キャラクターの画像用オブジェクトを作成
let RoadImg = new Image(); //デモ道の画像用オブジェクトを作成
let KonbiniImg = new Image();

KonbiniImg.src = "../Object_Sprite/konbini.png";//画像データの紐づけ
RoadImg.src = "../Object_Sprite/Road.png";//画像データの紐づけ
chImg.src = "../Character_Sprite/Player.png";//画像データの紐づけ

//フレームレート制御用変数
let FrameCount = 0;
let startTime;//メインループ開始時刻の保存用変数

//各クラス定義
//let is_stage;

//grandmaクラスインスタンス化
//プレイヤーのクラスを実体化
let Player = new player(100<<5, 100<<5);//キャラクタに関する演算を整数で行うためシフトして演算．描画の時に小数に戻す.
//マップのレイアウトクラスを実体化
let Map = new Field();

//キーボード入力情報格納用
let keyb = {
  Left: false,
  Right: false,
  Jump: false
};

//setInterval(mainLoop, 1000/60);//1秒間に60回mianLoopを呼び出す
//HTML読み込み終了後に実行＝ループ開始
window.onload = function(){    
    startTime = performance.now();//この命令実行時を0とする
    update();
    mainLoop();
}

//メインループ
function mainLoop(){
    let nowTime = performance.now();

    //プログラム開始からの時刻を，60fps時の更新間隔時間で割ると現時点で60fps
    //で動いた時のフレームカウントが出る．
    let nowFrame = (nowTime-startTime) / GAME_FPS;
    
    if(nowFrame > FrameCount){//更新可能な時＝60fpsを超えないとき
    let c = 0;

    while(nowFrame > FrameCount){//いまのフレーム数とフレーム制御の間に大差があるとき4倍で時間を進めて差を小さくする
    FrameCount++;//TODOバックグラウンドにウィンドウが長時間行ったときに不具合
    update();//出力画像データの更新．画像のどこを出力するか(snum)を更新
    if(++c >= 4)break;//ループ上限4回まで
    }

    //
    draw();//画像データの出力
    }
    requestAnimationFrame(mainLoop);
}


//更新処理
function update() {  
    Map.update();  
    Player.update();    
}

//アニメーション（スプライト番号依存の出力処理）
function drawSprite(snum, x, y){
    let sx = (snum & (BLOCK_PIXEL-1)) * BLOCK_PIXEL;//下位4bitと0b1111の＆
    let sy = (snum>>5)<<5;//(snum>>4) *16;//16で割って何行目か*ピクセル数
    vcon.drawImage(chImg, sx,sy, 32,64, x,y,32,64);//キャラクター表示仮想
}


//描画処理
function draw(){
vcon.fillStyle="#66AAFF";//プロパティcolor水色
vcon.fillRect(0,0,SCREEN_SIZE_W,SCREEN_SIZE_H);//メソッド画面表示
Map.draw();
Player.draw();

//デバッグ情報表示
vcon.font= "24px 'Impact'";
vcon.fillStyle="#FFFFFF";//プロパティcolor
vcon.fillText("FRAME : " +FrameCount, 10, 20);//readme参照

//仮想描画を実体にプロット
con.drawImage(vcan, 0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H, 0, 0, SCREEN_SIZE_W*3, SCREEN_SIZE_H*3);
}

// キーボードが押されたとき
document.addEventListener("keydown", function(e) {
    if (e.code === "Space") keyb.Jump = true;
    if (e.code === "ArrowLeft"||e.code === "KeyA")  keyb.Left  = true;
    if (e.code === "ArrowRight"||e.code === "KeyD") keyb.Right = true;
});

// キーボードが離されたとき
document.addEventListener("keyup", function(e) {
    if (e.code === "Space") keyb.Jump = false;
    if (e.code === "ArrowLeft"||e.code === "KeyA") keyb.Left  = false;
    if (e.code === "ArrowRight"||e.code === "KeyD") keyb.Right = false;
  });
 