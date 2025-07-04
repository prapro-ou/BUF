//htmlのキャンバスを操作するための宣言
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

//ゲーム画像サイズ
canvas.width = 1024
canvas.height = 576
//衝突マップを行ごとに分割
const collision_map = []
for(let i = 0;  i < collision.length; i+=MAP_WIDTH){
    collision_map.push(collision.slice(i, MAP_WIDTH+i))
}
const boudaries = []
/*collision_map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol  === 1025)
        boudaries.push(
            new col_default({
                location: {
                    x: j * TILE_SIZE + offset.x,
                    y: i * TILE_SIZE + offset.y
                }
            })
        )
    })    
})*/

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
        x: offset.x,
        y: offset.y
    },
    iamge: image
})
const Hero = new hero({
    location: {
        x: (canvas.width >> 1) - (playerImg_down.width >> 3),
        y: (canvas.height >> 1)
    },
    iamge: playerImg_down
})
const test_boundary = new col_default({location: {
        x:400, 
        y:400
    }
    })


//画像を読み込んだのちに実行する
image.onload = () => {
        animate()
}
playerImg_down.onload = () =>{
            Hero.width = (Hero.img.width) >> 2
            Hero.height = Hero.img.height
            console.log(Hero.width);
            console.log(Hero.height);
        }

function update(){
    Background.update()
    Hero.update()
}



function draw(){
    Background.draw()
    boudaries.forEach(boundary =>{
       boundary.draw()
    })
    test_boundary.draw();
    Hero.draw()
}

function animate(){
    window.requestAnimationFrame(animate)
    update()
    draw()
    //console.log('hero_up : ' + ((canvas.height>>1) + (Hero.height)));
    //console.log('Boundary.loc.y : ' + test_boundary.loc.y);    
    //衝突判定
    if(iscollide(test_boundary)){
        console.log('衝突してるよ');
    }
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