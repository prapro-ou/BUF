//htmlのキャンバスを操作するための宣言
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

//ゲーム画像サイズ
canvas.width = 1024
canvas.height = 576

//クラスのインスタンス化

const Background = new bg_default({
    location: {
        x: offset.x,//マップ画像データの左上を基準にする座標
        y: offset.y
    },
    iamge: bgImage
})
const Foreground = new fg_default({
    location: {
        x: offset.x,//マップ画像データの左上を基準にする座標
        y: offset.y
    },
    iamge: fgImage
})
const Npcs = []
const Hero = new hero({
    location: {
        x:  500, //初期画面の左上を基準にする相対座標
        y:  100//初期画面の左上を基準にする相対座標
    },
    iamge: playerImg_down
})
const Demo = new npc01({
    namae: "Demo",
    location: {
        x: 400,//初期画面の左上を基準にする相対座標
        y: 400//初期画面の左上を基準にする相対座標
    },
    iamge: playerImg_down
})
const Demo2 = new npc01({
    namae: "Demo2",
    location: {
        x:  400, //初期画面の左上を基準にする相対座標
        y:  500//初期画面の左上を基準にする相対座標
    },
    iamge: playerImg_down
})
Npcs.push(Demo)
Npcs.push(Demo2)
//衝突マップを行ごとに分割
const collision_map = []
for(let i = 0;  i < collision.length; i+=MAP_WIDTH){
    collision_map.push(collision.slice(i, MAP_WIDTH+i))
}
//衝突タイルマップを衝突ピクセルマップにする
const boundaries = []
collision_map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol  === 19723)
        boundaries.push(
            new col_default({
                //衝突マップのずれを調整
                location: {
                    x: j * TILE_SIZE + offset.x , //タイルのサイズを基準にする座標
                    y: i * TILE_SIZE + offset.y 
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
    findNearestNPC(Hero, Npcs) 
    console.log('Demo' + Demo.is_nearest)  
    if(keys.e.pressed = true) Npcs.forEach(npc => {
        if(npc.can_talk()) npc.talk()
    })
    Background.update()
    Hero.update()
}

function draw() {
    Background.draw();
    // キャラクターをまとめて配列に
    const EandH = [...Npcs, Hero];
    // Y座標で昇順に並び替え（奥→手前）
    EandH.sort((a, b) => a.loc.y - b.loc.y);
    // 並び替えた順に描画
    EandH.forEach(entity => entity.draw());
    //Foreground.draw();
}

function animate(){
    window.requestAnimationFrame(animate)
    update()
    draw()
}

// キーボードが押されたとき
document.addEventListener("keydown", function(e) {
    if (e.code === "Tab") {
        e.preventDefault() // ブラウザのタブ切り替えを防ぐ
        keys.tab.pressed = true
    }
    if (e.code === "KeyW") {
        keys.w.pressed  = true
    }
    if (e.code === "KeyA") {
        keys.a.pressed = true
    }
    if (e.code === "KeyS") {
        keys.s.pressed  = true
    }
    if (e.code === "KeyD") {
        keys.d.pressed = true
    }
    if (e.code === "KeyE") {
        keys.e.pressed = true
    }
})
// キーボードが離されたとき
document.addEventListener("keyup", function(e) {
    if (e.code === "KeyW") {
        keys.w.pressed  = false
    }
    if (e.code === "KeyA") {
        keys.a.pressed = false
    }
    if (e.code === "KeyS") {
        keys.s.pressed  = false
    }
    if (e.code === "KeyD") {
        keys.d.pressed = false
    }
    if (e.code === "KeyE") {
        keys.e.pressed = false
    }
  })