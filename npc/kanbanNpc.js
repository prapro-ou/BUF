//
//
//
class kanbanNpc extends npc01 {
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
  if (this.state === 1 && c_num < kanbanNpcdialog_1.length) {
    const text = kanbanNpcdialog_1[c_num];
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

  if (this.conv_num >= kanbanNpcdialog_1.length) {
    this.state = 2;
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

update(){
    this.frame++;

    // スペースキーが「今回押された」場合のみ conv_num++
    if(this.state === 1 && keys.space.pressed && !keys.space.wasPressed){
        this.conv_num++;
        keys.space.wasPressed = true;
    }

    // 毎フレーム最後に押下状態の更新を行う
    if (!keys.space.pressed) {
        keys.space.wasPressed = false;
    }

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
    Hero.is_talking = false;

    this.postChoiceDialog = this.choice === "yes" ? kanbanNpcdialog_yes : kanbanNpcdialog_no;
    this.state = 4;
    this.postChoiceIndex = 0;
    this.textProgress = 0;
  }

  if (!keys.a.pressed) keys.a.wasPressed = false;
  if (!keys.d.pressed) keys.d.wasPressed = false;
}
}

draw(){
    if (!this.img_loaded) return; // 読み込み前なら描画しない
    //NPCの画像を描画
    switch (this.state){
        case 0 : this.draw00();
                 break; 
        case 1 : this.draw01();
                 break;
        case 2:  this.draw01(); // 会話文の表示（選択前）
                 drawChoiceUI(this.loc.x + 20, this.loc.y + 100, this.choice);
                 break;
        case 3 : this.draw00();
                 break;
    }
    }
    
}