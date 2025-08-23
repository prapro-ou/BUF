//htmlのキャンバスを操作するための宣言
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
let isInShop = false;
let quizActive = false;
let whoseQuiz = null;
let helpHide = false;

let quizIndex 
let currentQuiz 
let selectedBlank 
let userAnswers 
let result    

let gameState = INTRO;


c.imageSmoothingEnabled = false;

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
      if (!bgm.paused) {
        bgm.pause();
        bgm.currentTime = 0;
      }
      shop_bgm.volume = 0.2
      shop_bgm.loop = true;
      shop_bgm.currentTime = 0
      shop_bgm.play()
      console.log("🛒 ショップに入りました！");
      break;
    }
  }
}
function triggerQuiz(npc) {
    if (!bgm.paused) {
  bgm.pause();
  bgm.currentTime = 0;
}
  quizActive = true;
  quizList.length = 0; // ← ここでリセット！
  switch(npc) {
    case KANBAN:
      whoseQuiz = KANBAN;
      quizList.push(kanbanQuiz);
      break;
    case KUSA:
      whoseQuiz = KUSA;
      quizList.push(kusaQuiz);
      break;
    case HASI:
      whoseQuiz = HASI;
      quizList.push(hasiQuiz_1);
      quizList.push(hasiQuiz_2);
      break;
    case SYUBOUSYA:
      whoseQuiz = SYUBOUSYA;
      quizList.push(bossQuiz);
      break;
    case TREASURE:
      whoseQuiz = TREASURE;
      quizList.push(treasureQuiz);
      break;
  }
    quiz_bgm.currentTime = 0;
    quiz_bgm.volume = 0.6;
    quiz_bgm.play();
    quiz_bgm.loop = true;
    quizIndex = 0;
    currentQuiz = quizList[quizIndex];
    userAnswers = Array(currentQuiz.blanks.length).fill(null);
    selectedBlank = null;
    result = null;
    codeScrollY = 0;
    dragging = null;
    dragOrigin = null;
    isTimeout = false;
    timerId = null;

    startTimer();
    drawQuiz();
}
function endQuiz() {
  quizActive = false;
  clearInterval(timerId);

  // クイズBGM停止
  quiz_bgm.pause();
  quiz_bgm.currentTime = 0;

  // 通常BGM再開（必要なら）
  bgm.currentTime = 0;
  bgm.play();

  // 状態リセット（必要に応じて）
  currentQuiz = null;
  userAnswers = [];
  dragging = null;
  dragOrigin = null;
  codeScrollY = 0;
  isTimeout = false;
  whoseQuiz = null;
// ✅ Canvasの描画設定をリセット
  c.font = "20px 'M PLUS 1p'";
  c.textAlign = 'left';
  c.textBaseline = 'top';
  draw()
  // 演出や報酬処理を追加するならここ
  // showReward(), updateNPCState(), etc.
}
function updatePlaying(deltaTime) {
  if (quizActive) return; // クイズ中は更新停止
  if(keys.i.pressed && !keys.i.wasPressed){
    helpHide = !helpHide
  }
  findNearestNPC(Hero, npcs);

  if (keys.tab.pressed) {
    keys.tab.pressed = false;
    Hero.inv.inventoryVisible = !Hero.inv.inventoryVisible;
  }

  if (keys.e.pressed && !keys.e.wasPressed) {
    keys.e.wasPressed = true;

    if (isInShop) {
      shop_bgm.pause()
      bgm.currentTime = 0;
      bgm.play();
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
    if (bgm.paused) bgm.play();
    Background.update(deltaTime);
  }
  keys.i.wasPressed = keys.i.pressed;
}
let currentIntroIndex = 0;
// 現在どこまで表示したか
let introCharIndex      = 0;
// 文字を1つ表示する間隔（ミリ秒）
const introTypingInterval = 50; 
// 経過時間を溜める
let introTypingElapsed  = 0;
// 文字送り完了フラグ
let introTypingFinished = false;
function updateIntro(deltaTime) {
  // イントロ中は常にインベントリ非表示
  Hero.inv.inventoryVisible = false;
  Hero.inv.display();

  const fullText = introMessage[currentIntroIndex];

  if (!introTypingFinished) {
    // タイプライター文字送り
    introTypingElapsed += deltaTime;
    if (introTypingElapsed >= introTypingInterval) {
      introTypingElapsed -= introTypingInterval;
      introCharIndex++;
      if (introCharIndex >= fullText.length) {
        introCharIndex = fullText.length;
        introTypingFinished = true;
      }
    }
  } else {
    // 全文表示済み → スペースキーで次へ
    if (keys.space.pressed && !keys.space.wasPressed) {
      next_conv.currentTime = 0;
      next_conv.volume = 0.5
      next_conv.play();
      currentIntroIndex++;
      if (currentIntroIndex >= introMessage.length) {
        gameState = PLAYING;
        // BGM再生
        bgm.loop = true; // ループ再生
        bgm.volume = 0.4; // 音量（0.0～1.0）l
        bgm.play();
      } else {
        // 次のメッセージへ移行時にタイプ設定をリセット
        introCharIndex      = 0;
        introTypingElapsed  = 0;
        introTypingFinished = false;
      }
    }
  }

  // 次フレーム用に状態をキャッシュ
  keys.space.wasPressed = keys.space.pressed;
}


 let frame = 0
function update(deltaTime) {
  frame++;
  if (frame > 10000000) frame = 0;

  switch (gameState) {
    case INTRO:
      updateIntro(deltaTime);
      break;
    case PLAYING:
      updatePlaying(deltaTime);
      break;
  }
}

function drawIntro() {
  const fullText = introMessage[currentIntroIndex];
  const text     = fullText.substring(0, introCharIndex);

  // 1. 背景クリア
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  // 2. ドット絵フォント設定
  c.imageSmoothingEnabled      = false;
  canvas.style.imageRendering = 'pixelated';
  c.font         = "16px 'DotGothic16', monospace";
  c.fillStyle    = "white";
  c.textAlign    = "center";
  c.textBaseline = "middle";

  // 3. 自動改行ロジック
  const maxWidth   = canvas.width * 0.8;
  const lineHeight = 20;
  const words      = text.split(" ");
  const lines      = [];
  let line         = "";

  for (let w of words) {
    const test = line + w + " ";
    if (c.measureText(test).width > maxWidth && line) {
      lines.push(line.trim());
      line = w + " ";
    } else {
      line = test;
    }
  }
  lines.push(line.trim());

  // 4. 中央揃えで描画
  const totalHeight = lines.length * lineHeight;
  let y = canvas.height / 2 - totalHeight / 2 + lineHeight / 2;
  for (let l of lines) {
    c.fillText(l, canvas.width / 2, y);
    y += lineHeight;
  }

  // 5. 末尾案内文の描画
  const isDone  = introCharIndex >= fullText.length;
  const marginX = 20;
  const marginY = 20;
  // フレームを16分割して点滅
// (frame >> 4) で16フレームごとにカウントが1つずつ下がり、&1で偶数奇数を判定
if (((frame >> 6) & 1) === 0 && isDone) {
  c.font         = "14px 'DotGothic16', monospace";
  c.fillStyle    = "white";
  c.textAlign    = "right";
  c.textBaseline = "bottom";
  c.fillText("▼ spaceで進む", canvas.width - marginX, canvas.height - marginY);
}

}



let canBuy = true;
function drawShopUI() {
  c.drawImage(shopImage, 0, 0, canvas.width, canvas.height);
  helpUI();
  c.drawImage(kaziya, 50, 200, 450, 450);
  drawSpeechBubbleMultiline("いらっしゃい！何を買うんだい？", 100, 180, 999);

  c.font = "24px Arial";
  c.fillStyle = "gold";
  c.fillText(`🪙 所持コイン: ${Hero.coin}`, 700, 150);

  shopItems.forEach((item, index) => {
  let label = `${item.name} - ${item.price}コイン`;
  drawItemButton(label, 700, 200 + index * 100, () => {
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
function drawQuiz() {
  // 砂時計の所持数表示
  const hourglass = Hero.inv.items.find(i => i.name === "砂時計");
  const count = hourglass ? hourglass.count : 0;
  // 問題ごとに背景画像を切り替え
    if (whoseQuiz === KANBAN) {
    if (bgImageKanban.complete) {
      c.drawImage(bgImageKanban, 0, 0, canvas.width, canvas.height);
    } else {
      c.fillStyle = '#888'; c.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else if (whoseQuiz === KUSA) {
    if (bgImageKusa.complete) {
      c.drawImage(bgImageKusa, 0, 0, canvas.width, canvas.height);
    } else {
      c.fillStyle = '#888'; c.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else if (whoseQuiz === HASI) {
    if (bgImageHasi.complete) {
      c.drawImage(bgImageHasi, 0, 0, canvas.width, canvas.height);
    } else {
      c.fillStyle = '#888'; c.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else if (whoseQuiz === SYUBOUSYA) {
    if (bgImageKuromaku.complete) {
      c.drawImage(bgImageKuromaku, 0, 0, canvas.width, canvas.height);
    } else {
      c.fillStyle = '#888'; c.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else if (whoseQuiz === TREASURE) {
    if (bgImageTakarabako.complete) {
      c.drawImage(bgImageTakarabako, 0, 0, canvas.width, canvas.height);
    } else {
      c.fillStyle = '#888'; c.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
  c.font = "20px 'M PLUS 1p', sans-serif";
  c.fillStyle = "#00ffcc";
  c.fillText(`⏳ 砂時計: ${count}個`, canvas.width - 100, 70); // 右上に表示

  // 問題文の色
  if (whoseQuiz === KANBAN || whoseQuiz === HASI || whoseQuiz === KUSA) {
    c.fillStyle = '#000000'; // 1問目だけ黒色
  } else {
    c.fillStyle = 'white';
  }

  c.font         = '24px sans-serif';
  c.textAlign    = 'left';
  c.textBaseline = 'top';
  // 問題文の行数取得
  const qLines = wrapText(
    currentQuiz.question,
    codeX, codeY,
    codeMaxWidth, 28
  );

  // クリッピング範囲を先に定義（4問目以外でも使えるように）
  const clipX = codeX;
  const clipY = codeY + qLines * 28 + 10;
  const clipW = 420;
  const clipH = 450; // 必要に応じて調整

  // プログラム描画エリアのクリッピング（4問目と5問目のみ）
  if (quizIndex === 3 || quizIndex === 4) {
    c.save();
    c.beginPath();
    c.rect(clipX, clipY, clipW, clipH);
    c.clip();
  }

  // コード描画
  if (whoseQuiz === KANBAN || whoseQuiz === HASI || whoseQuiz === KUSA) {
    c.fillStyle = '#000000'; // 1問目だけ黒色
  } else {
    c.fillStyle = 'white';
  }
  c.font         = "18px monospace";
  c.textAlign    = 'left';
  c.textBaseline = 'top';
  const rawCodeLines = currentQuiz.code.trim().split('\n');
  let codeLines = rawCodeLines.slice();
  const codeYStart = codeY + qLines * 28 + 10 - ((quizIndex === 3 || quizIndex === 4) ? codeScrollY : 0);
  codeLines.forEach((line, i) => {
    // \\n を \n に変換して表示
    const displayLine = line.replace(/\\\\n/g, '\\n');
    c.fillText(displayLine, codeX, codeYStart + i * 22);
  });

  // クリッピング解除
  if (quizIndex === 3 || quizIndex === 4) {
    c.restore();
  }

  // — 空欄（_____）処理 —
  const tag = currentQuiz.code.match(/_{2,}/)[0];
  const tagWidth = c.measureText(tag).width;

  currentQuiz.blanks.forEach((blank, bidx) => {
    for (let i = 0; i < codeLines.length; i++) {
      const pos = codeLines[i].indexOf(tag);
      if (pos === -1) continue;

      // 幅測定は rawCodeLines から
      const prefix = rawCodeLines[i].slice(0, pos);
      const px     = codeX + c.measureText(prefix).width;
      const py     = codeYStart + i * 22 - 10;

      const radiusX = tagWidth / 2;
      const radiusY = 14;
      const centerX = px + tagWidth / 2;
      const centerY = py + radiusY;

      // ★ 4問目と5問目のclip範囲外なら描画しない
      if (
        (quizIndex === 3 || quizIndex === 4) &&
        (centerY < clipY || centerY > clipY + clipH)
      ) {
        // clip範囲外なので何も描画しない
      } else {
        // ■ 回答前のみ枠線を描く
        if (userAnswers[bidx] === null) {
          c.save();
          c.beginPath();
          c.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
          // 1,3,4問目は黒色
          c.strokeStyle = (quizIndex === 0 || quizIndex === 2 || quizIndex === 3) ? '#000000' : '#fff';
          c.lineWidth   = 2;
          c.stroke();
          c.restore();
        }

        // ■ 回答済みなら文字だけ中央に描画
        if (userAnswers[bidx] !== null) {
          c.save();
          // 1,3,4問目は黒色
        if (whoseQuiz === KANBAN || whoseQuiz === HASI || whoseQuiz === KUSA) {
            c.fillStyle = '#000b41ff'; // 1問目だけ黒色
          } else {
            c.fillStyle = '#d4ff00ff';
          }          
          c.font         = '18px monospace';
          c.textAlign    = 'center';
          c.textBaseline = 'middle';  
          c.fillText(
            currentQuiz.choices[userAnswers[bidx]],
            centerX, centerY
          );
          c.restore();
        }
      }

      // クリック判定用矩形をセット
      blank.rect = {
        x:  px,
        y:  py,
        w:  tagWidth,
        h:  radiusY * 2,
        cx: centerX,
        cy: centerY
      };

      codeLines[i] = codeLines[i].replace(tag, ' '.repeat(tag.length));
      break;
    }
  });

  // — 選択肢描画 —
  c.font         = '22px sans-serif';
  c.textAlign    = 'center';
  c.textBaseline = 'middle';
  if (!currentQuiz.choiceRects) currentQuiz.choiceRects = [];
  currentQuiz.choices.forEach((choice, i) => {
    const cx = choiceX;
    const cy = choiceBaseY + i * choiceGap;
    c.save();
    c.beginPath();
    c.ellipse(cx, cy, 70, 28, 0, 0, 2 * Math.PI);
    // ★ 1問目:クリーム色, 2問目:#C9DFEC, 5問目:濃い赤, その他:茶色
    c.fillStyle = (quizIndex === 0) ? '#FFFFF0'
      : (quizIndex === 1) ? '#63768D'
      : (quizIndex === 2) ? '#FFFFF0'
      : (quizIndex === 3) ? '#FFFFF0'
      : (quizIndex === 4) ? '#8B0000'
      : (quizIndex === 5) ? '#BA8448'
      : '#A0522D';
    c.fill();
    c.strokeStyle = '#fff';
    c.lineWidth   = 2;
    c.stroke();
    c.fillStyle = (quizIndex === 0 || quizIndex === 2 || quizIndex === 3) ? '#000000' : '#fff';
    c.fillText(choice, cx, cy);
    c.restore();
    currentQuiz.choiceRects[i] = {
      x:  cx - 70,
      y:  cy - 28,
      w:  140,
      h:  56,
      cx, cy
    };
  });

  // — ドラッグ中プレビュー —
  if (dragging) {
    c.save();
    c.beginPath();
    c.ellipse(dragging.x, dragging.y, 70, 28, 0, 0, 2 * Math.PI);
    c.fillStyle   = '#66f';
    c.fill();
    c.strokeStyle = '#fff';
    c.lineWidth   = 2;
    c.stroke();
    c.fillStyle   = '#fff';
    c.font        = '22px sans-serif';
    c.textAlign   = 'center';
    c.textBaseline= 'middle';
    c.fillText(
      currentQuiz.choices[dragging.choiceIdx],
      dragging.x, dragging.y
    );
    c.restore();
  }

  // — 答え合わせボタン —
  if (userAnswers.every(a => a !== null)) {
    c.fillStyle = '#444';
    c.fillRect(buttonX, 470, 200, 48);
    c.fillStyle = 'white';
    c.font       = '24px sans-serif';
    c.textAlign  = 'center';
    c.textBaseline = 'middle';
    c.fillText('答え合わせ', buttonX + 100, 470 + 24);
  }

  // — 時間延長ボタン —
  c.fillStyle = '#444';
  c.fillRect(extendButtonX, extendButtonY, extendButtonW, extendButtonH);
  c.fillStyle = 'white';
  c.font       = '24px sans-serif';
  c.textAlign  = 'center';
  c.textBaseline = 'middle';
  c.fillText('時間延長', extendButtonX + extendButtonW / 2, extendButtonY + extendButtonH / 2);

  // — やり直しボタン —
  c.fillStyle = '#444';
  c.fillRect(buttonX, 524, 200, 48);
  c.fillStyle = 'white';
  c.font       = '24px sans-serif';
  c.textAlign  = 'center';
  c.textBaseline = 'middle';
  c.fillText('やり直し', buttonX + 100, 524 + 24);

  // — 正誤表示 —
  if (result !== null) {
    c.font      = '28px sans-serif';
    c.fillStyle = result ? 'lime' : 'red';
    c.fillText(
      result ? '全問正解！' : '間違いがあります',
      choiceX, 80
    );
  }

  // — タイマー表示 —
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  c.font = '24px sans-serif';
   if (whoseQuiz === KANBAN || whoseQuiz === HASI || whoseQuiz === KUSA) {
    c.fillStyle = '#000000'; // 1問目だけ黒色
  } else {
    c.fillStyle = 'white';
  }
  if(isTimeout)c.fillStyle = 'red';
  c.textAlign = 'right';
  c.fillText(`残り時間: ${min}分${sec}秒`, canvas.width - 40, 40);

  // — 時間切れ表示 —
  if (isTimeout) {
    c.font = '48px sans-serif';
    c.fillStyle = 'red';
    c.textAlign = 'center';
    c.fillText('時間切れ', canvas.width / 2, canvas.height / 2);
    setTimeout(() => {
    endQuiz();
  }, 2000); // 2秒後に終了（演出の余韻）
  }
}
function drawDefault(){
  if(bgm.paused) 
     {bgm.loop = true; // ループ再生
      bgm.volume = 0.4; // 音量（0.0～1.0）l
      bgm.play();}
  Background.draw();
  const entities = [...npcs, ...kusas, Hero];
  entities.sort((a, b) => (a.loc?.y || 0) - (b.loc?.y || 0));
  entities.forEach(entity => entity.draw());
  Foreground.draw();
  helpUI();
  drawCoinText(c, Hero.coin);
}
function draw() {
if(gameState === INTRO) {
  drawIntro();
  return;
}
if(gameState === PLAYING){
  if (quizActive) {
    drawQuiz(); // クイズUI描画
    return;
  }
  
  if (isInShop) {
    drawShopUI();
    return;
  }
 
  drawDefault();
}
  
}

function startGame() {
  if (fgImage.complete) {
    requestAnimationFrame(animate);
  } else {
    fgImage.onload = () => {
      gameState = INTRO;
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
    if (e.code === "KeyI") {
        keys.i.pressed = true
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
    if (e.code === "KeyI") {
        keys.i.pressed = false
    }
    if (e.code === "KeyE") {
        keys.e.pressed = false
        keys.e.wasPressed = false; // ← これが重要！
    }
    if (e.code === "Space") {
        keys.space.pressed = false
    }
  })

canvas.addEventListener('click', e => {
  if (!quizActive) return;

  const rect = canvas.getBoundingClientRect();
  const mx   = e.clientX - rect.left;
  const my   = e.clientY - rect.top;

  // 答え合わせボタン
  const isAnswerButtonClicked =
    userAnswers.every(a => a !== null) &&
    mx >= buttonX && mx <= buttonX + 200 &&
    my >= 470    && my <= 518 &&
    !isTimeout;

  if (isAnswerButtonClicked) {
    result = currentQuiz.blanks.every((b, i) =>
      userAnswers[i] === b.answer
    );

    // 効果音
    const se = result ? seCorrect : seWrong;
    se.currentTime = 0;
    se.play();

    drawQuiz();

    if (result && quizIndex < quizList.length - 1) {
      // 正解 & 次の問題あり → 次へ
      setTimeout(() => {
        quizIndex++;
        currentQuiz = quizList[quizIndex];
        userAnswers = Array(currentQuiz.blanks.length).fill(null);
        selectedBlank = null;
        result        = null;
        currentQuiz.choiceRects = null;
        startTimer();
        drawQuiz();
      }, 1200);
    } else {
      // 最終問題 or 不正解 → 終了
      setTimeout(() => {
        endQuiz();
      }, 2000);
    }

    return;
  }

  // 時間延長ボタン
if (
  mx >= extendButtonX && mx <= extendButtonX + extendButtonW &&
  my >= extendButtonY && my <= extendButtonY + extendButtonH
) {
  const hourglass = Hero.inv.items.find(i => i.name === "砂時計");

  if (hourglass && hourglass.count > 0) {
    // 時間延長処理
    timeLeft += 30;
    seGauge.currentTime = 0;
    seGauge.play();
    drawQuiz();

    // 砂時計を1つ消費
    Hero.inv.removeItem({ name: "砂時計", count: 1 });

    return;
  } else {
    console.log("⏳ 砂時計がないため時間延長できません");
  }
}


  // やり直しボタン
  if (
    mx >= buttonX && mx <= buttonX + 200 &&
    my >= 524    && my <= 524 + 48
  ) {
    userAnswers = Array(currentQuiz.blanks.length).fill(null);
    selectedBlank = null;
    result        = null;
    currentQuiz.choiceRects = null;
    codeScrollY   = 0;
    drawQuiz();
    return;
  }
});

// — ドラッグ＆ドロップ — 
canvas.addEventListener('mousedown', e => {
  if(!quizActive)return
  const rect = canvas.getBoundingClientRect();
  const mx   = e.clientX - rect.left;
  const my   = e.clientY - rect.top;
  currentQuiz.choiceRects.forEach((r, i) => {
    if (
      r && mx >= r.x && mx <= r.x + r.w &&
      my >= r.y && my <= r.y + r.h
    ) {
      seClick.currentTime = 0;
      seClick.play();
      dragging = {
        choiceIdx: i,
        x: mx,
        y: my,
        offsetX: mx - r.cx,
        offsetY: my - r.cy
      };
      dragOrigin = { x: r.cx, y: r.cy };
      drawQuiz();
    }
  });
});

canvas.addEventListener('mousemove', e => {
  if(!quizActive)return
  if (!dragging) return;
  const rect = canvas.getBoundingClientRect();
  dragging.x = e.clientX - rect.left;
  dragging.y = e.clientY - rect.top;
  drawQuiz();
});

canvas.addEventListener('mouseup', e => {
  if(!quizActive)return
  if (!dragging) return;
  const rect = canvas.getBoundingClientRect();
  const mx   = e.clientX - rect.left;
  const my   = e.clientY - rect.top;
  let set = false;
  currentQuiz.blanks.forEach((b, i) => {
    const r = b.rect;
    if (
      r && mx >= r.x && mx <= r.x + r.w &&
      my >= r.y && my <= r.y + r.h
    ) {
      userAnswers[i] = dragging.choiceIdx;
      set = true; // ←追加
    }
  });
  if (set) {                 // ←追加
    seKeyboard2.currentTime = 0;
    seKeyboard2.play();
  }
  dragging   = null;
  dragOrigin = null;
  drawQuiz();
});

// — スクロールイベント —
canvas.addEventListener('wheel', e => {
  if(!quizActive)return
  // 4問目(3)と5問目(4)だけスクロール有効
  if (quizIndex !== 3 && quizIndex !== 4) {
    codeScrollY = 0;
    return;
  }
  const rawCodeLines = currentQuiz.code.trim().split('\n');
  const visibleLines = 20; // 表示できる行数（調整可）
  const maxScroll = Math.max(0, rawCodeLines.length * 22 - visibleLines * 22);

  codeScrollY += e.deltaY;
  if (codeScrollY < 0) codeScrollY = 0;
  if (codeScrollY > maxScroll) codeScrollY = maxScroll;
  drawQuiz();
  e.preventDefault();
}, { passive: false });