//
//便利な関数保存用
//

//衝突しているかどうか
function iscollide(boundary){
        return (boundary.loc.x < ((canvas.width>>1) + (HERO_W) - 20)&&
                boundary.loc.x + TILE_SIZE> ((canvas.width>>1) + 20)&&
                boundary.loc.y < ((canvas.height>>1) + (HERO_H))&&
                boundary.loc.y + (TILE_SIZE>>1) > ((canvas.height>>1))+20)
    }
function nearNpc(npc) {
    const heroCenter = {
        x: canvas.width / 2 + HERO_W / 2,
        y: canvas.height / 2 + HERO_H / 2
    };
    const npcCenter = {
        x: npc.loc.x + NPC_W / 2+8,
        y: npc.loc.y + NPC_H / 2
    };
    return distance(heroCenter, npcCenter) < 140;
}

//プレイヤーから一番近いNPCを探索
function findNearestNPC(hero, npcList) {
    let nearestNPC = null;
    let minDist = Infinity;

    npcList.forEach(npc => {
        const dx = npc.loc.x - hero.loc.x;
        const dy = npc.loc.y - hero.loc.y;
        const distSquared = dx * dx + dy * dy;

        if (distSquared < minDist) {
            minDist = distSquared;
            nearestNPC = npc;
        }
    });

    npcList.forEach(npc => npc.is_nearest = false); // 全 NPC を false にリセット

    if (nearestNPC) {
        nearestNPC.is_nearest = true; // 最も近い NPC に true
    }
}


//二つの座標構造体をふけ取り２エンティティの距離を計算
function distance(locA, locB){
    const dx = locA.x - locB.x;
    const dy = locA.y - locB.y;
    return Math.sqrt(dx * dx + dy * dy); // ユークリッド距離
}

function drawSpeechBubbleMultiline(text, x, y, progress) {
  const padding = 12;
  const maxWidth = 320;
  const lineHeight = 24;
  const maxCharsPerLine = 15; // 1行あたりの最大文字数（フォントサイズに応じて調整）

  // 表示する文字列（progress に応じて切り取る）
  const visibleText = text.slice(0, progress);

  // 改行処理：一定文字数ごとに改行
  const lines = [];
  for (let i = 0; i < visibleText.length; i += maxCharsPerLine) {
    lines.push(visibleText.slice(i, i + maxCharsPerLine));
  }

  const bubbleHeight = lines.length * lineHeight + padding * 2;
  const bubbleWidth = maxWidth;
  c.save();
  c.font = "20px 'M PLUS 1p'";
  c.textAlign = "left";
  c.textBaseline = "top";
  c.fillStyle = "white";

  // 吹き出しの背景
  c.fillStyle = "black";
  c.fillRect(x, y - bubbleHeight, bubbleWidth, bubbleHeight);

  // 枠線
  c.strokeStyle = "#00ffcc";
  c.lineWidth = 2;
  c.strokeRect(x, y - bubbleHeight, bubbleWidth, bubbleHeight);

  // テキスト描画
  c.fillStyle = "white";
  c.font = "20px 'M PLUS 1p'"; // ✅ レトロ風フォント
  lines.forEach((line, index) => {
    c.fillText(line, x + padding, y - bubbleHeight + padding + lineHeight * (index + 1) -20);
  });
}

function drawChoiceUI(x, y, selected) {
  const fontSize = 20;
  const spacing = 100;
  const paddingX = 20;
  const paddingY = 10;

  const yesX = x;
  const noX = x + spacing;
  const baseY = y;

  // 背景ボックスのサイズと位置
  const boxX = yesX - paddingX;
  const boxY = baseY - fontSize - paddingY;
  const boxWidth = spacing + fontSize * 2 + paddingX * 2+3;
  const boxHeight = fontSize + paddingY * 2;

  // 背景
  c.fillStyle = "black";
  c.fillRect(boxX, boxY, boxWidth, boxHeight);

  // 枠線
  c.strokeStyle = "#00ffcc";
  c.lineWidth = 2;
  c.strokeRect(boxX, boxY, boxWidth, boxHeight);

  // テキスト
  c.font = `${fontSize}px 'M PLUS 1p'`;
  c.fillStyle = "white";
  c.font = `${fontSize}px 'Press Start 2P'`;

  // カーソル
  const cursorOffset = 12;
  if (selected === "yes") {
    c.fillText("▶", yesX - cursorOffset, baseY-22);
  } else {
    c.fillText("▶", noX - cursorOffset, baseY-22);
  }

  // 選択肢
  c.fillText("YES", yesX+14, baseY-19);
  c.fillText("NO", noX+14, baseY-19);
}
 function Quiz(){
    return true;
 }
function removeBoundaryAt(x, y) {
    const index = boundaries.findIndex(boundary => 
        boundary.loc.x === x && boundary.loc.y === y
    );
    if (index !== -1) boundaries.splice(index, 1);
}
function removeBoundaryAtTile(tileX, tileY) {
    collision_map[tileY][tileX] = 0;
    const x = tileX * TILE_SIZE + offset.x;
    const y = tileY * TILE_SIZE + offset.y;
    removeBoundaryAt(x, y);
}
function logBoundaryAtTile(tileX, tileY) {
    const x = tileX * TILE_SIZE + offset.x;
    const y = tileY * TILE_SIZE + offset.y;

    const exists = boundaries.some(boundary =>
        Math.floor(boundary.loc.x) === Math.floor(x) &&
        Math.floor(boundary.loc.y) === Math.floor(y)
    );

    if (exists) {
        console.log(`🧱 タイル(${tileX}, ${tileY})に対応する衝突ブロックが boundaries に存在します。`);
    } else {
        console.log(`🚫 タイル(${tileX}, ${tileY})に対応する衝突ブロックは boundaries に存在しません。`);
    }
}

function nearShopEntrance(shop) {
    const heroCenter = {
        x: canvas.width / 2 + HERO_W / 2,
        y: canvas.height / 2 + HERO_H / 2
    };
    const shopCenter = {
        x: shop.loc.x,
        y: shop.loc.y
    };
    return distance(heroCenter, shopCenter) < 96;
}
function enterShop(){
    return
}
function drawItemButton(label, x, y, onClick) {
  // ボタン描画
  c.fillStyle = "black";
  c.fillRect(x, y, 200, 40);
  c.strokeStyle = "#00ffcc";
  c.strokeRect(x, y, 200, 40);
  c.fillStyle = "white";
  c.font = "20px 'M PLUS 1p'";
  c.fillText(label, x + 10, y + 8);

  // クリック判定（購入制限付き）
  canvas.addEventListener("mousedown", function handler(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (
      mx >= x && mx <= x + 200 &&
      my >= y && my <= y + 40 &&
      canBuy
    ) {
      canBuy = false;
      onClick();
      // 一定時間後に再購入可能に
      setTimeout(() => {
        canBuy = true;
      }, 300); // 300msロック
    }

    canvas.removeEventListener("mousedown", handler); // 一度だけ反応
  });
}

function onQuestClear(npcId) {
  switch (npcId) {
    case "kanbanNpc":
      shopItems.push({
        name: "FOR",
        price: 0,
        zaiko: 1,
        description: "一度使えば、同じ行動を何度でも繰り返せるようになる…かもしれない。",
        onBuy: () => {
          Hero.inv.addItem({ name: "FOR", count: 1, description: "一度使えば、同じ行動を何度でも繰り返せるようになる…かもしれない。" });
          Hero.hasFor = true; // ← フラグを立てるだけでOK
        }
      });
      break;
    case "kusaNpc":
      shopItems.push({
        name: "IF",
        price: 0,
        zaiko: 1,
        description: "条件によって行動を変える力。選択の意味が、少しだけ分かるようになるかもしれない。",
        onBuy: () => {
          Hero.hasIf = true; // ← IF文のフラグを立てる
          Hero.inv.addItem({ name: "IF", count: 1, description: "条件によって行動を変える力。選択の意味が、少しだけ分かるようになるかもしれない。"});
        }
      });
      break;

}
}

function resetMovementKeys() {
  keys.w.pressed = false;
  keys.a.pressed = false;
  keys.s.pressed = false;
  keys.d.pressed = false;
}

function splitMapData(data, width) {
  const result = [];
  for (let i = 0; i < data.length; i += width) {
    result.push(data.slice(i, i + width));
  }
  return result;
}

function drawCoinText(ctx, coinAmount) {
  ctx.save();
  ctx.font = '18px sans-serif';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // シャドウで視認性アップ
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 4;

  ctx.fillText(`💰 ${coinAmount} G`, 12, 12);
  ctx.restore();
}

function helpUI() {
  const instructions_default = [
    "操作方法:",
    "WASDキーで移動，選択肢移動",
    "TABキーで持ち物一覧表示",
    "NPCに近づいてEキーで会話",
    "spaceキーで会話を進める",
    "道具屋入口でEキーで入店"
  ];
  const instructions_shop = ["         　　❕Eキーで店を出る"];
  const instructions = isInShop ? instructions_shop : instructions_default;

  c.save();
  c.font = '18px sans-serif';
  c.fillStyle = 'white';
  c.textAlign = 'left';
  c.textBaseline = 'top';
  c.shadowColor = 'black';
  c.shadowBlur = 4;

  const startX = canvas.width - 250;
  const startY = 20;
  const lineHeight = 24;

  instructions.forEach((line, index) => {
    c.fillText(line, startX, startY + index * lineHeight);
  });

  c.restore();
}

function gameInstruction(){
  c.save();
  c.font = '24px sans-serif';
  c.fillStyle = 'white';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.shadowColor = 'black';
  c.shadowBlur = 4;

  const instructions = [
    "このゲームはプログラミングの基礎を学ぶためのものです。",
    "NPCと会話し、クイズに答えて新しい道具を手に入れましょう。",
    "道具を使って、より複雑な選択や繰り返しを体験できます。",
    "楽しみながらプログラミングの概念を理解しましょう！",
    "（スペースキーで進む）"
  ];

  const startX = canvas.width / 2;
  const startY = canvas.height / 2 - (instructions.length * 15);
  const lineHeight = 30;

  instructions.forEach((line, index) => {
    c.fillText(line, startX, startY + index * lineHeight);
  });

  c.restore();

}