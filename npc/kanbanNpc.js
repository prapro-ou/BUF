//
//
//
class kanbanNpc extends npc01 {
    constructor({npc_num, location}){
    super({npc_num, location})
    this.quizEvaluated = false
    this.num = npc_num;
    this.loc = location;
    this.is_nearest = false
    this.img = new Image();
    this.img_loaded = false;
    this.img.onload = () => {
        this.img_loaded = true;
    };
    this.img.src = kanbanNpcImage.src;
    this.conv_num = 0
    this.state = 0
    this.frame = 0
    this.choice = null  
    this.postChoiceDialog = null; // yes/no に応じた会話配列
    this.postChoiceIndex = 0;
    this.textProgress = 0;
    this.textSpeed = 1;
    }
    can_talk(){
        return this.is_nearest
    }
    talk(){
        switch (this.state){
            case 0 : this.state = 1;
                     break;
            case 3 : this.state = 4;
                     break;
        }
    }
draw_conv(c_num) {
  let dialog = null;

  // 会話データの選択
  if (this.state === 1) {
    dialog = kanbanNpcdialog_1;
  } else if (this.state === 4 || this.state === 6) {
  dialog = this.postChoiceDialog;
}

  // 会話が存在する場合のみ描画
  if (dialog && this.conv_num < dialog.length) {
    const text = dialog[this.conv_num];
    drawSpeechBubbleMultiline(text, this.loc.x, this.loc.y, this.textProgress);

    // テキスト進行
    if (this.textProgress < text.length) {
      this.textProgress += this.textSpeed;
      const prevProgress = this.textProgress;
      // SE再生（進行があった場合のみ）

      // npc_speak.currentTime = 0;
      // npc_speak.play();
    }

    // スペースキーで次の文へ
    if (this.textProgress >= text.length && keys.space.pressed && !keys.space.wasPressed) {
      this.conv_num++;
      this.textProgress = 0;
      keys.space.wasPressed = true;
    }
  }

  // 会話終了処理
  if (dialog && this.conv_num >= dialog.length) {
    if (this.state === 1) {
      this.state = 2; // 選択肢表示へ
    } else if (this.state === 4) {
      // ✅ 選択後の分岐処理
      if (this.postChoiceDialog === kanbanNpcdialog_yes) {
        
        this.state = 5; // YES選択 → クイズ開始
      } else if (this.postChoiceDialog === kanbanNpcdialog_no) {
        this.state = 0; // NO選択 → 状態リセット
        Hero.is_talking = false;
      }
    } else if (this.state === 6) {
  if (this.postChoiceDialog === kanbanNpcdialog_lose) {
    this.state = 0;
    Hero.is_talking = false;
  } else if (this.postChoiceDialog === kanbanNpcdialog_clear) {
    Hero.is_talking = false;
    Hero.coin += 1000
    get_coin.currentTime = 0;
    get_coin.volume = 0.5
    get_coin.play();
    // ✅ 自分自身を npcs 配列から削除
    const index = npcs.indexOf(this);
    if (index !== -1) {
      npcs.splice(index, 1);
    }
    onQuestClear("kanbanNpc")
    //新しい衝突マップにする
    collision_map.length = 0;
    boundaries.length = 0;  
    for(let i = 0;  i < collision2.length; i+=MAP_WIDTH){
    collision_map.push(collision2.slice(i, MAP_WIDTH+i))
    }
    collision_map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol  === 472)
        boundaries.push(
            new col_default({
                //衝突マップのずれを調整
                location: {
                    x: j * TILE_SIZE + offset.x + Background.totalOffset.x, //タイルのサイズを基準にする座標
                    y: i * TILE_SIZE + offset.y + Background.totalOffset.y
                }
            })
        )
    })    
})
  }
}


    this.conv_num = 0;
    this.textProgress = 0;
  }
}




draw00(){
    c.drawImage(
        this.img, 
        0, 32, NPC_W, NPC_H,
        this.loc.x, this.loc.y,
        NPC_W*3, NPC_H*3
    );
    c.drawImage(
        wait_icon, 
        32*((this.frame >> 4) % 4) , 0, 32, 64,
        this.loc.x+34, this.loc.y-48,
        32, 64 
    )}
draw01(){
    c.drawImage(
        this.img, 
        0, 32, NPC_W, NPC_H,
        this.loc.x, this.loc.y,
        NPC_W*3, NPC_H*3
    );
    this.draw_conv(this.conv_num)
}

update() {
  this.frame++;
  // スペースキーが「今回押された」場合のみ conv_num++
  if (this.state === 1 && keys.space.pressed && !keys.space.wasPressed) {
    this.conv_num++;
    next_conv.currentTime = 0;
    next_conv.volume = 0.5
    next_conv.play();
    keys.space.wasPressed = true;
  }

  // 選択肢処理
  if (this.state === 2) {
    if (keys.a.pressed && !keys.a.wasPressed) {
      this.choice = "yes";
      keys.a.wasPressed = true;
    }
    if (keys.d.pressed && !keys.d.wasPressed) {
      this.choice = "no";
      keys.d.wasPressed = true;
    }

    if (keys.space.pressed && !keys.space.wasPressed) {
      keys.space.wasPressed = true;
      this.postChoiceDialog = this.choice === "yes" ? kanbanNpcdialog_yes : kanbanNpcdialog_no;
      this.state = 4;
      this.quizEvaluated = false; // ← ここで初期化
      this.postChoiceIndex = 0;
      this.textProgress = 0;
    }

    if (!keys.a.pressed) keys.a.wasPressed = false;
    if (!keys.d.pressed) keys.d.wasPressed = false;
  }

  // クイズ処理（状態5）
  if (this.state === 5 && !this.quizEvaluated) {
  const result = Quiz();
  this.postChoiceDialog = result ? kanbanNpcdialog_clear : kanbanNpcdialog_lose;
  this.state = 6;
  this.conv_num = 0;
  this.textProgress = 0;
  this.quizEvaluated = true;
}


  // 毎フレーム最後に押下状態の更新
  if (!keys.space.pressed) {
    keys.space.wasPressed = false;
  }
}


draw() {
  if (!this.img_loaded) return;

  switch (this.state) {
    case 0: this.draw00(); break;
    case 1: this.draw01(); break;
    case 2:
      this.draw01();
      drawChoiceUI(this.loc.x + 20, this.loc.y + 100, this.choice);
      break;
    case 4:
    case 6: this.draw01(); break;
  }
}

    
}