//htmlのキャンバスを操作するための宣言
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

//ゲーム画像サイズ
canvas.width = 1024
canvas.height = 576

//ゲーム画面の色をわかりやすく白に設定
c.fillStyle = "white"

//画面の描画範囲
c.fillRect(0, 0, canvas.width, canvas.height)

//画像を読み込み
const image = new Image()
image.src = '../img/DemoMap.png'
const playerImage = new Image()
playerImage.src = '../img/playerDown.png'

//c.drawImage(image, 0, 0)
//画像を読み込んだのちに実行する
image.onload = () => {
        animate()
}

function animate(){
    console.log('anime')
    window.requestAnimationFrame(animate)
        c.drawImage(image, -521, -1210) //プレイヤー初期画面
    c.drawImage(
        playerImage, 
        0,
        0,
        playerImage.width>>2,
        playerImage.height,

        canvas.width>>1, 
        canvas.height>>1,
        playerImage.width>>2,
        playerImage.height) //プレイヤーを画面の中心に
}

// キーボードが押されたとき
document.addEventListener("keydown", function(e) {
    if (e.code === "KeyW") keyb.Up  = true;
    if (e.code === "KeyA") keyb.Left = true;
    if (e.code === "KeyS") keyb.Down  = true;
    if (e.code === "KeyD") keyb.Right = true;
});
// キーボードが離されたとき
document.addEventListener("keyup", function(e) {
    if (e.code === "KeyW") keyb.Up  = false;
    if (e.code === "KeyA") keyb.Left = false;
    if (e.code === "KeyS") keyb.Down  = false;
    if (e.code === "KeyD") keyb.Right = false;
  });