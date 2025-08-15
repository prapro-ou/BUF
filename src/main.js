//htmlのキャンバスを操作するための宣言
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
let isInShop = false;

//ゲーム画像サイズ
canvas.width = 1024
canvas.height = 576

// BGM再生
const bgm = new Audio('../sound/BUF_opening_final_demo.wav');
bgm.loop = true; // ループ再生
bgm.volume = 0.5; // 音量（0.0～1.0）
bgm.play();

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
        if(symbol  === 472)
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
const shop_map = []
for(let i = 0;  i < shop_data.length; i+=MAP_WIDTH){
    shop_map.push(shop_data.slice(i, MAP_WIDTH+i))
}
//衝突タイルマップを衝突ピクセルマップにする
const shops = []
shop_map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol  === 472)
        shops.push(
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
        switch (symbol) {
            case 500 : npcs.push(new kanbanNpc({
                    npc_num: symbol,
                //衝突マップのずれを調整
                    location: {
                        x: j * TILE_SIZE + offset.x , //タイルのサイズを基準にする座標
                        y: i * TILE_SIZE + offset.y 
                    }
                }));
                break;
            // case 377 : npcs.push(new npc377({
            //         npc_num: symbol,
            //     //衝突マップのずれを調整
            //         location: {
            //             x: j * TILE_SIZE + offset.x , //タイルのサイズを基準にする座標
            //             y: i * TILE_SIZE + offset.y 
            //         }
            //     }));
            //     break;
            // case 378 : npcs.push(new npc378({
            //         npc_num: symbol,
            //     //衝突マップのずれを調整
            //         location: {
            //             x: j * TILE_SIZE + offset.x , //タイルのサイズを基準にする座標
            //             y: i * TILE_SIZE + offset.y 
            //         }
            //     }));
            //     break;
            default : break;
        }
        
    })    
})


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
function go_shop() {
  for (let i = 0; i < shops.length; i++) {
    const shopBlock = shops[i];
    if (nearShopEntrance(shopBlock)) {
      isInShop = true;
      console.log("🛒 ショップに入りました！");
      break;
    }
  }
}


function update() {
  findNearestNPC(Hero, npcs);

  if (keys.tab.pressed) {
    keys.tab.pressed = false;
    Hero.inv.inventoryVisible = !Hero.inv.inventoryVisible;
  }

  if (keys.e.pressed && !keys.e.wasPressed) {
    keys.e.wasPressed = true;

    if (isInShop) {
      isInShop = false;
      console.log("🚪 ショップから出ました");
    } else {
      invoke_talk();
      go_shop();
    }
  }

  npcs.forEach(npc => npc.update());

  // Hero.update() は常に呼び出す
  Hero.update();

  // 背景移動は UIが出ていないときだけ
  if (!Hero.inv.inventoryVisible && !isInShop && !Hero.is_talking) {
    Background.update();
  }
}


let canBuy = true;

function drawShopUI() {
  c.drawImage(shopImage, 0, 0, canvas.width, canvas.height);
  c.drawImage(kaziya, 50, 200, 450, 450);
  drawSpeechBubbleMultiline("いらっしゃい！何を買うんだい？", 100, 180, 999);

  c.font = "24px Arial";
  c.fillStyle = "gold";
  c.fillText(`🪙 所持コイン: ${Hero.coin}`, 700, 150);

  shopItems.forEach((item, index) => {
  drawItemButton(item.name, 700, 200 + index * 100, () => {
    if (Hero.coin >= item.price) {
      if (item.zaiko > 0) {
        item.onBuy();
        Hero.coin -= item.price;
        item.zaiko--;

        console.log(`🛒 ${item.name}購入！残りコイン: ${Hero.coin} / 在庫: ${item.zaiko}`);

        // 在庫が0になったら商品を削除
        if (item.zaiko <= 0) {
          console.log(`❌ ${item.name}は売り切れました`);
          shopItems.splice(index, 1);
        }
      } else {
        console.log(`⚠️ ${item.name}は売り切れです`);
      }
    } else {
      console.log("💸 コインが足りません！");
    }
  });
});

}


function draw() {
  if (isInShop) {
    drawShopUI();
    return;
  }

  // 通常描画
  Background.draw();
  const EandH = [...npcs, Hero];
  EandH.sort((a, b) => a.loc.y - b.loc.y);
  EandH.forEach(entity => entity.draw());
  boundaries.forEach(boundary => boundary.draw());
  Hero.draw();
  Foreground.draw();
}

function startGame() {
  // 画像がすでに読み込まれていれば即開始
  if (fgImage.complete) {
    animate();
  } else {
    fgImage.onload = () => {
      animate();
    };
  }
}

function animate(){
    window.requestAnimationFrame(animate)
    update()
    draw()
}

// キーボードが押されたとき
document.addEventListener("keydown", function(e) {
    if (bgm.paused) bgm.play();
    
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
    if (e.code === "Space") {
        keys.space.pressed = true
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
         keys.e.wasPressed = false; // ← これが重要！
    }
    if (e.code === "Space") {
        keys.space.pressed = false
    }
  })
  document.addEventListener("keyup", function(e) {
  if (e.code === "KeyE") {
    keys.e.pressed = false;
    keys.e.wasPressed = false; // ← これが重要！
  }

  // 他キーも同様に
});
