//htmlのキャンバスを操作するための宣言
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

//ゲーム画像サイズ
canvas.width = 1024
canvas.height = 576

//画像を読み込み
const bgImage = new Image()
bgImage.src = '../img/DemoMap.png'
const fgImage = new Image()
fgImage.src = '../img/DemoMapFG.png'
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
        x: offset.x,
        y: offset.y
    },
    iamge: bgImage
})
const Foreground = new fg_default({
    location: {
        x: offset.x,
        y: offset.y
    },
    iamge: fgImage
})
const Hero = new hero({
    location: {
        x: (canvas.width >> 1) - (playerImg_down.width >> 3),
        y: (canvas.height >> 1)
    },
    iamge: playerImg_down
})
//衝突マップを行ごとに分割
const collision_map = []
for(let i = 0;  i < collision.length; i+=MAP_WIDTH){
    collision_map.push(collision.slice(i, MAP_WIDTH+i))
}
const boudaries = []
collision_map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol  === 1025)
        boudaries.push(
            new col_default({
                //衝突マップのずれを調整
                location: {
                    x: j * TILE_SIZE + offset.x /*+16*/,
                    y: i * TILE_SIZE + offset.y  -16
                }
            })
        )
    })    
})

//画像を読み込んだのちに実行する
fgImage.onload = () => {
        animate()
}

function update(){
    Background.update()
    Hero.update()
    
}

function draw(){
    Background.draw()
    boudaries.forEach(boundary => {
        boundary.draw()
    })
    Hero.draw()
    Foreground.draw()
}

function animate(){
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