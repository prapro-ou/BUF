class BOSS extends npc01 {
  constructor({ npc_num, location }) {
    super({ npc_num, location });
    this.num = npc_num;
    this.loc = location;
    this.is_nearest = false;
    this.img = new Image();
    this.img_loaded = false;
    this.img.onload = () => {
      this.img_loaded = true;
    };
    this.img.src = BOSSImage.src;
    this.conv_num = 0;
    this.state = 0;
    this.frame = 0;
    this.choice = null;
    this.postChoiceDialog = null;
    this.postChoiceIndex = 0;
    this.textProgress = 0;
    this.textSpeed = 0.25;
  }

  can_talk() {
    return this.is_nearest;
  }

  talk() {
      switch (this.state) {
        case 0:
          this.state = 1; // 初回会話
          break;
        case 3:
          this.state = 4; // 選択後会話
          break;
    }
  }

  draw_conv(c_num) {
    let dialog = null;

    if (this.state === 1) {
      dialog = BOSSdialog_1;
    } else if (this.state === 4 || this.state === 6) {
      dialog = this.postChoiceDialog;
    } 

    if (dialog && this.conv_num < dialog.length) {
      const text = dialog[this.conv_num];
      drawSpeechBubbleMultiline(text, this.loc.x, this.loc.y, this.textProgress);

      if (this.textProgress < text.length) {
        this.textProgress += this.textSpeed;
      }

      if (this.textProgress >= text.length && keys.space.pressed && !keys.space.wasPressed) {
        this.conv_num++;
        next_conv.currentTime = 0;
        next_conv.volume = 0.5
        next_conv.play();
        this.textProgress = 0;
        keys.space.wasPressed = true;
      }
    }

    if (dialog && this.conv_num >= dialog.length) {
      if (this.state === 1) {
        this.state = 2; // 選択肢表示へ
      } else if (this.state === 4) {
        // ✅ 選択後の分岐処理
      if (this.postChoiceDialog === BOSSdialog_yes) {
        gameState = RAINING
        this.state = 5;
        bgm.pause()
        initRain()
        transition_bgm.currentTime = 0
        transition_bgm.volume = 0.5
      if(transition_bgm.paused) transition_bgm.play()
        setTimeout(() => {
          whoseQuiz = SYUBOUSYA
          transition(QUIZ, SYUBOUSYA); // ← main.js 側で定義された遷移処理
        }, 6000); // ← 演出の長さは調整可能
      } else if (this.postChoiceDialog === BOSSdialog_no) {
        this.state = 0; // NO選択 → 状態リセット
        Hero.is_talking = false;
      }
      } else if (this.state === 6) {
        if (this.postChoiceDialog === BOSSdialog_lose) {
          this.state = 0;
          Hero.is_talking = false;
        } else if (this.postChoiceDialog === BOSSdialog_clear) {
          Hero.is_talking = false;
          Hero.coin += 5000;
          collision_map.length = 0;
          boundaries.length = 0;
          for(let i = 0;  i < collision5.length; i+=MAP_WIDTH){
          collision_map.push(collision5.slice(i, MAP_WIDTH+i))
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
          });
          const index = npcs.indexOf(this);
          dissmiss_npc.currentTime = 0;
          dissmiss_npc.volume = 0.5
          dissmiss_npc.play();
          if (index !== -1) npcs.splice(index, 1);
          npcs.push(new treasureBox({
                    npc_num: 777,
                //衝突マップのずれを調整
                    location: {
                        x: this.loc.x,
                        y: this.loc.y + 96 
                    }
                }));
          // 宝箱をアクティブにするなどの演出
        //   treasureBox.state = 1;
        }
      }
      this.conv_num = 0;
      this.textProgress = 0;
    }
  }
    

  draw00() {
    c.drawImage(this.img,  0, 32, NPC_W, NPC_H, this.loc.x-16, this.loc.y+40, NPC_W * 4, NPC_H * 4);
  }

  draw01() {
    c.drawImage(this.img,  0, 32, NPC_W, NPC_H, this.loc.x -16, this.loc.y+40, NPC_W * 4, NPC_H * 4);
    this.draw_conv(this.conv_num);
  }

  update() {
    this.frame++;

    if ((this.state === 1 || this.state === 4 || this.state === 6 || this.state === -1) &&
        keys.space.pressed && !keys.space.wasPressed) {
        next_conv.currentTime = 0;
    next_conv.volume = 0.5
    next_conv.play();
      this.conv_num++;
      keys.space.wasPressed = true;
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
        this.postChoiceDialog = this.choice === "yes" ? BOSSdialog_yes : BOSSdialog_no;
        this.state = 4;
        this.quizEvaluated = false;
        this.postChoiceIndex = 0;
        this.textProgress = 0;
      }

      if (!keys.a.pressed) keys.a.wasPressed = false;
      if (!keys.d.pressed) keys.d.wasPressed = false;
    }

    if (this.state === 5) {
      this.postChoiceDialog = result ? BOSSdialog_clear : BOSSdialog_lose;
      this.state = 6;
      this.conv_num = 0;
      this.textProgress = 0;
    }

    if (!keys.space.pressed) {
      keys.space.wasPressed = false;
    }
  }

  draw() {
    if (!this.img_loaded) return;

    switch (this.state) {
      case -1: this.draw01(); break;
      case 0: this.draw00(); break;
      case 1: this.draw01(); break;
      case 2:
        this.draw01();
        drawChoiceUI(this.loc.x + 20, this.loc.y + 100, this.choice);
        break;
      case 4: this.draw01(); break;
      case 6: this.draw01(); break;
    }
  }
}
