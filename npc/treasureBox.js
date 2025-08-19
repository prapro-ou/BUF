//
//はしNPCのクラス
//
class treasureBox extends npc01 {
    constructor({npc_num, location}){
    super({npc_num, location})
    this.num = npc_num;
    this.loc = location;
    this.is_nearest = false
    this.img = new Image();
    this.img_loaded = false;
    this.img.onload = () => {
        this.img_loaded = true;
    };
    this.img.src = treasureBoxImage.src;
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
        if(!Hero.hasIf) this.state  = -1
        switch (this.state){
            case 0 : this.state = 1;
                     break;
            case 3 : this.state = 4;
                     break;
            case 7 : this.state = 8;
        }
    }
draw_conv(c_num) {
  let dialog = null;

  // 会話データの選択
  if (this.state === 1) {
    dialog = treasureBoxdialog_1;
  } else if (this.state === 4 || this.state === 6) {
  dialog = this.postChoiceDialog;
} else if (this.state === -1) {
  dialog = treasureBoxdialog_noIf;
} else if (this.state === 8) {
  dialog = treasureBoxdialog_end
}

  // 会話が存在する場合のみ描画
  if (dialog && this.conv_num < dialog.length) {
    const text = dialog[this.conv_num];
    drawSpeechBubbleMultiline(text, this.loc.x, this.loc.y, this.textProgress);

    // テキスト進行
    if (this.textProgress < text.length) {
      this.textProgress += this.textSpeed;
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
      if (this.postChoiceDialog === treasureBoxdialog_yes) {
        this.state = 5; // YES選択 → クイズ開始
      } else if (this.postChoiceDialog === treasureBoxdialog_no) {
        this.state = 0; // NO選択 → 状態リセット
        Hero.is_talking = false;
      }
    } else if (this.state === 6) {
  if (this.postChoiceDialog === treasureBoxdialog_lose) {
    this.state = 0;
    Hero.is_talking = false;
  } else if (this.postChoiceDialog === treasureBoxdialog_clear) {
    Hero.is_talking = false;
    console.log("a")
    Hero.coin += 5000
    this.state = 7
    // ✅ 自分自身を npcs 配列から削除
    // const index = npcs.indexOf(this);
    // if (index !== -1) {
    //   npcs.splice(index, 1);
    // }
    //onQuestClear("kusaNpc")\
    // npcs.forEach(npc => {
    //   if (npc instanceof kusaBabaNpc) {
    //     npc.state = 2;
    //   }p
    // });
    // kusas.forEach(kusa => kusa.state = 1)
    //新しい衝突マップにする
  }
} else if (this.state === -1){
  this.state = 0;
  Hero.is_talking = false;
} else if (this.state === 8){
  this.state = 7;
  Hero.is_talking = false 
}


    this.conv_num = 0;
    this.textProgress = 0;
  }
}

draw00(){
    c.drawImage(
        this.img, 
        32, 0, 32, 32,
        this.loc.x-8, this.loc.y,
        NPC_W*4, NPC_H*4
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
        32, 0, 32, 32,
        this.loc.x-8, this.loc.y,
        NPC_W*4, NPC_H*4
    );
    this.draw_conv(this.conv_num)
}
draw02(){
    c.drawImage(
        this.img, 
        32, 0, 32, 32,
        this.loc.x-8, this.loc.y,
        NPC_W*4, NPC_H*4
    );
}
update() {
  this.frame++;

  // スペースキーが「今回押された」場合のみ conv_num++
  if (this.state === 1 && keys.space.pressed && !keys.space.wasPressed) {
    this.conv_num++;
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
      this.postChoiceDialog = this.choice === "yes" ? treasureBoxdialog_yes : treasureBoxdialog_no;
      this.state = 4;
      this.postChoiceIndex = 0;
      this.textProgress = 0;
    }

    if (!keys.a.pressed) keys.a.wasPressed = false;
    if (!keys.d.pressed) keys.d.wasPressed = false;
  }

  // クイズ処理（状態5）
  if (this.state === 5) {
    const result = Quiz(); // クイズ実行
    this.postChoiceDialog = result ? treasureBoxdialog_clear : treasureBoxdialog_lose;
    this.state = 6;
    this.conv_num = 0;
    this.textProgress = 0;
  }

  // 毎フレーム最後に押下状態の更新
  if (!keys.space.pressed) {
    keys.space.wasPressed = false;
  }

}
draw() {
  if (!this.img_loaded) return;

  switch (this.state) {
    case -1:this.draw01(); break;
    case 0: this.draw00(); break;
    case 1: this.draw01(); break;
    case 2:
      this.draw01();
      drawChoiceUI(this.loc.x + 20, this.loc.y + 100, this.choice);
      break;
    case 4: this.draw01(); break;
    case 6: this.draw01(); break;
    case 7: this.draw02(); break;
    case 8: this.draw01(); break;
  }
}
}
