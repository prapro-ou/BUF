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

// 使用例
const collision_map = splitMapData(collision, MAP_WIDTH);
const shop_map = splitMapData(shop_data, MAP_WIDTH);
const npc_map = splitMapData(npc_loc, MAP_WIDTH);
const kusa_map = splitMapData(kusa_loc, MAP_WIDTH);

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
            case 501 : npcs.push(new kusaBabaNpc({
                    npc_num: symbol,
                //衝突マップのずれを調整
                    location: {
                        x: j * TILE_SIZE + offset.x , //タイルのサイズを基準にする座標
                        y: i * TILE_SIZE + offset.y 
                    }
                }));
                break;
            case 502 : npcs.push(new kusaNpc({
                    npc_num: symbol,
                //衝突マップのずれを調整
                    location: {
                        x: j * TILE_SIZE + offset.x , //タイルのサイズを基準にする座標
                        y: i * TILE_SIZE + offset.y 
                    }
                }));
                break;
            case 503 : npcs.push(new hasiNpc({
                    npc_num: symbol,
                //衝突マップのずれを調整
                    location: {
                        x: j * TILE_SIZE + offset.x , //タイルのサイズを基準にする座標
                        y: i * TILE_SIZE + offset.y 
                    }
                }));
                break;
            case 506 : npcs.push(new BOSS({
                    npc_num: symbol,
                //衝突マップのずれを調整
                    location: {
                        x: j * TILE_SIZE + offset.x , //タイルのサイズを基準にする座標
                        y: i * TILE_SIZE + offset.y 
                    }
                }));
                break;            
            default : break;
        }
        
    })    
})

const kusas = []
kusa_map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol  === 473)
        kusas.push(
            new kusa_default({
                //衝突マップのずれを調整
                location: {
                    x: j * TILE_SIZE + offset.x , //タイルのサイズを基準にする座標
                    y: i * TILE_SIZE + offset.y 
                }
            })
        )
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
 let frame = 0
function update(deltaTime) {
  frame++;
  if(frame > 10000000) frame = 0
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

  npcs.forEach(npc => npc.update(deltaTime));
  if (((frame << 4) % 2) === 0) {
    kusas.forEach(kusa => kusa.update(deltaTime));
  }

  Hero.update(deltaTime);

  if (!Hero.inv.inventoryVisible && !isInShop && !Hero.is_talking) {
    Background.update(deltaTime);
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

  Background.draw();

  // 描画対象をまとめてY座標でソート
  const entities = [...npcs, ...kusas, Hero];
  entities.sort((a, b) => (a.loc?.y || 0) - (b.loc?.y || 0));
  entities.forEach(entity => entity.draw());
  Foreground.draw();
}


function startGame() {
  if (fgImage.complete) {
    requestAnimationFrame(animate);
  } else {
    fgImage.onload = () => {
      requestAnimationFrame(animate);
    };
  }
}


const FPS = 60; // 目標フレームレート
const FRAME_INTERVAL = 1000 / FPS; // 1フレームの間隔（ミリ秒）
let lastTime = 0;

function animate(currentTime) {
  window.requestAnimationFrame(animate);

  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  update(deltaTime);
  draw();
}



// キーボードが押されたとき
document.addEventListener("keydown", function(e) {
    if (bgm.paused) {
    bgm.play().catch(err => {
        console.warn("BGM再生に失敗しました:", err);
    });
    }
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