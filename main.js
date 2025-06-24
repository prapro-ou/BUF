//仮想キャンバス宣言
let vcan = document.createElement("canvas");
let vcon = vcan.getContext("2d");

//実態キャンバス宣言
let can = document.getElementById("can");//描画領域適宜
let con = can.getContext("2d");//どう描くかを制御 

//仮想キャンバスサイズ宣言
vcan.width = SCREEN_SIZE_W;
vcan.height = SCREEN_SIZE_H;

//実態キャンバスサイズ宣言
can.width = SCREEN_SIZE_W*2;
can.height = SCREEN_SIZE_H*2;

//描画のぼやぼやをなくすメソッド
con.mozimageSmoothingEnabled = false;
con.msimageSmoothingEnabled = false;
con.webkitimageSmoothingEnabled = false;
con.imageSmoothingEnabled = false;

//キャラクター表示
let chImg = new Image(); //Imageというオブジェクトを作成
let RoadImg = new Image();

RoadImg.src = "Road.png";
chImg.src = "demo_main_char.png";//画像読み込み
//chImg.onload = draw;//読み込み終了後onloadの関数drawを実行

//フレームレート制御
let FrameCount = 0;
let startTime;

//各クラス定義
let is_stage;
let Player = new MainCharacter(100<<4, 100<<4);//キャラクタに関する演算を整数で行うためシフトして演算．描画の時に小数に戻す.
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
    startTime = performance.now();
    update();
    mainLoop();
} 

//メインループ
function mainLoop(){
    let nowTime = performance.now();
    let nowFrame = (nowTime-startTime) / GAME_FPS;//今のプログラム時間，60fpsで動いた時のフレーム数
    
    if(nowFrame > FrameCount){//更新可能な時＝60fpsを超えないとき
    let c = 0;

    while(nowFrame > FrameCount){//いまのフレーム数とフレーム制御の間に大差があるとき4倍で時間を進めて差を小さくする
    FrameCount++;               //TODOバックグラウンドにウィンドウが長時間行ったときに不具合
    update();//出力画像データの更新．画像のどこを出力するか(snum)を更新
    if(++c >= 50)break;
    }

    //
    draw();//画像デaータの出力
    }
    requestAnimationFrame(mainLoop);
}


//更新処理
function update() {    
    Player.update();
    Map.update();
}

//アニメーション（スプライト番号依存の出力処理）
function drawSprite(snum, x, y){
    let sx = (snum&15) *16;
    let sy = (snum>>4) *16;
    vcon.drawImage(chImg, sx,sy,16,32, x>>4,y>>4,16,32);//キャラクター表示仮想
}
function drawSprite2(snum, x, y){
    let sx = (snum&15) *16;
    let sy = (snum>>4) *16;
    vcon.drawImage(RoadImg, sx,sy,60,30, x,y,60,30);//キャラクター表示仮想
}

//描画処理
function draw(){
vcon.fillStyle="#66AAFF";//プロパティcolor水色
vcon.fillRect(0,0,SCREEN_SIZE_W,SCREEN_SIZE_H);//メソッド画面表示
Player.draw();
Map.draw();
//デバッグ情報表示
vcon.font= "24px 'Impact'";
vcon.fillStyle="#FFFFFF";//プロパティcolor
vcon.fillText("FRAME : " +FrameCount, 10, 20);//readme参照

//仮想描画を実体にプロット
con.drawImage(vcan, 0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H, 0, 0, SCREEN_SIZE_W*2, SCREEN_SIZE_H*2);
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
