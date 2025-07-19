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
const Hero = new hero({
    location: {
        x:  canvas.width/2, //初期画面の左上を基準にする相対座標
        y:  canvas.height/2//初期画面の左上を基準にする相対座標
    },
    iamge: playerImg_down
})
//衝突マップを行ごとに分割
const collision_map = []
for(let i = 0;  i < collision.length; i+=MAP_WIDTH){
    collision_map.push(collision.slice(i, MAP_WIDTH+i))
}
//衝突タイルマップを衝突ピクセルマップにする
const boundaries = []
collision_map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol  === 374)
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

//NPCの位置をマップデータから解析
const npc_map = []
for(let i = 0;  i < npc_loc.length; i+=MAP_WIDTH){
    npc_map.push(npc_loc.slice(i, MAP_WIDTH+i))
}
const npcs = []
npc_map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol  === 375)
        npcs.push(
            new npc01({
                npc_num: symbol,
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

//eでインタラクトして，NPCの会話に関する関数フックとする
function invoke_talk(){
    for(let i = 0; i < npcs.length; i++){ 
            const npc = npcs[i];
            if(nearNpc({npc, loc:{
                x:npc.loc.x , 
                y:npc.loc.y
            }})){
                if(npc.can_talk()) {
                    Hero.is_talking = true
                    npc.talk()
                }
            }    
        }
}

function update(){
    findNearestNPC(Hero, npcs) //一番近くのNPCを割り出す
    if(keys.e.pressed){
        invoke_talk()
    }  
    if(!Hero.is_talking){
    Background.update()
    Hero.update()
    }

}

function draw() {
    Background.draw();
    // キャラクターをまとめて配列に
    const EandH = [...npcs, Hero];
    // // Y座標で昇順に並び替え（奥→手前）
    EandH.sort((a, b) => a.loc.y - b.loc.y);
    // // 並び替えた順に描画
    EandH.forEach(entity => entity.draw());
    // boundaries.forEach(boundary => {
    //     boundary.draw()
    // })
    Hero.draw();
    Foreground.draw();
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