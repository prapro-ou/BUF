//
//
//
class kusaBabaNpc extends npc01 {
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
    this.img.src = kusaBaba_cry.src;
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
            case 2 : this.state = 3;
                     break;
            case 4 : this.state = 5;
                     break;
        }
    }
draw_conv(c_num) {
  let dialog = null;

  // 会話データの選択
  if (this.state === 1) {
    dialog = kusaBabadialog_lose;
  }  else if (this.state === 3){ 
    dialog = kusaBabadialog_clear
   }else if (this.state === 5) {
    dialog = kusaBabadialog_clear2
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
      this.state = 0; // 選択肢表示へ
      Hero.is_talking = false
    } else if (this.state === 3) {
      this.state = 4
      Hero.coin += 1000
      Hero.is_talking = false 
    } else if (this.state === 5) {
      this.state = 4
      Hero.is_talking = false 
    } 
    this.conv_num = 0;
    this.textProgress = 0;

}

}




draw00(){
    
    c.drawImage(
        this.img, 
        32, 0, NPC_W, NPC_H,
        this.loc.x, this.loc.y,
        NPC_W*3, NPC_H*3
    );
}
draw01(){
    console.log(this.state)
    c.drawImage(
        this.img, 
        32, 0, NPC_W, NPC_H,
        this.loc.x, this.loc.y,
        NPC_W*3, NPC_H*3
    );
    // draw_conv() はここでは呼ばない
}


update() {
  this.frame++;
  if (this.state === 2 && this.img.src !== kusaBaba_hpy.src) {
  this.img.src = kusaBaba_hpy.src;
}
  // スペースキーが「今回押された」場合のみ conv_num++
  if ((this.state === 1 || this.state === 3 || this.state === 5) && keys.space.pressed && !keys.space.wasPressed) {
    this.conv_num++;
    keys.space.wasPressed = true;
  }

  // 毎フレーム最後に押下状態の更新
  if (!keys.space.pressed) {
    keys.space.wasPressed = false;
  }
}


draw() {
  if (!this.img_loaded) return;

  switch (this.state) {
    case 0:
      this.draw00();
      break;

    case 1:
      this.draw00();
      this.draw_conv(this.conv_num);
      break;

    case 2:
    this.draw01();
    this.draw_conv(this.conv_num); // ← これを追加！
    break;

    case 3:
      this.draw01();
      this.draw_conv(this.conv_num);
      break;

    case 4:
      this.draw01();
      break;

    case 5:
      this.draw01();
      this.draw_conv(this.conv_num);
      break;
  }
}


    
}