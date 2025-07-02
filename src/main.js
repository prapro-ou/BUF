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
const playerImg_down = new Image()
      playerImg_down.src = '../img/playerDown.png'
const playerImg_up = new Image()
      playerImg_up.src = '../img/playerUp.png'
const playerImg_right = new Image()
      playerImg_right.src = '../img/playerRight.png'
const playerImg_left = new Image()
      playerImg_left.src = '../img/playerLeft.png'

//クラスのインスタンス化
const Background = new bg_default({
    location: {
        x:-521,
        y:-1210
    },
    iamge: image
})
const Hero = new hero({
    location: {
        x:-521,
        y:-1210
    },
    iamge: playerImg_down
})
//画像を読み込んだのちに実行する
image.onload = () => {
        animate()
}

function update(){
    Background.update()
    Hero.update()
}

function draw(){
    Background.draw()
    Hero.draw()
}

function animate(){
    console.log('anime')
    window.requestAnimationFrame(animate)
    update()
    draw()
}

// キーボードが押されたとき
document.addEventListener("keydown", function(e) {
    if (e.code === "KeyW") {
        keys.w.pressed  = true
        Hero.is_stopping = false
    }
    if (e.code === "KeyA") {
        keys.a.pressed = true
        Hero.is_stopping = false
    }
    if (e.code === "KeyS") {
        keys.s.pressed  = true
        Hero.is_stopping = false
    }
    if (e.code === "KeyD") {
        keys.d.pressed = true
        Hero.is_stopping = false
    }
})
// キーボードが離されたとき
document.addEventListener("keyup", function(e) {
    if (e.code === "KeyW") {
        keys.w.pressed  = false
        Hero.is_stopping = true
    }
    if (e.code === "KeyA") {
        keys.a.pressed = false
        Hero.is_stopping = true
    }
    if (e.code === "KeyS") {
        keys.s.pressed  = false
        Hero.is_stopping = true
    }
    if (e.code === "KeyD") {
        keys.d.pressed = false
        Hero.is_stopping = true
    }
  })