class treasureBox extends npc01 {
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
    this.img.src = treasureBoxImage.src;
    this.conv_num = 0;
    this.state = 0;
    this.frame = 0;
    this.choice = null;
    this.postChoiceDialog = null;
    this.textProgress = 0;
    this.textSpeed = 1;
  }

  can_talk() {
    return this.is_nearest;
  }

  talk() {
    switch (this.state) {
      case 0:
        this.state = 1; // 初回会話開始
        break;
      case 3:
        this.state = 4; // 選択後の会話再開
        break;
      case 7:
        this.state = 8; // クリア後の再会話
        break;
    }
  }

  draw_conv(c_num) {
    let dialog = null;

    if (this.state === 1) {
      dialog = treasureBoxdialog_1;
    } else if (this.state === 4 || this.state === 6) {
      dialog = this.postChoiceDialog;
    } else if (this.state === 8) {
      dialog = treasureBoxdialog_clear;
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
        this.state = 2;
      } else if (this.state === 4) {
        // ✅ 選択後の分岐処理
      if (this.postChoiceDialog === treasureBoxdialog_yes) {
        this.state = 5; // YES選択 → クイズ開始
        triggerQuiz(TREASURE); // ← main.js 側で定義
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
          Hero.coin += 5000;
          this.state = 7;
        }
      } else if (this.state === 8) {
        this.state = 7;
        Hero.is_talking = false;
      }

      this.conv_num = 0;
      this.textProgress = 0;
    }
  }

  draw00() {
    c.drawImage(
      this.img,
      0, 0, 64, 64,
      this.loc.x, this.loc.y,
      NPC_W * 3, NPC_H * 3
    );
  }

  update() {
    this.frame++;

    if ([1, 4, 6, 8].includes(this.state) &&
        keys.space.pressed && !keys.space.wasPressed) {
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
        this.postChoiceDialog = this.choice === "yes" ? treasureBoxdialog_yes : treasureBoxdialog_no;
        this.state = 4;
        this.quizEvaluated = false;
        this.textProgress = 0;
      }

      if (!keys.a.pressed) keys.a.wasPressed = false;
      if (!keys.d.pressed) keys.d.wasPressed = false;
    }

    if (this.state === 5) {
      this.postChoiceDialog = result ? treasureBoxdialog_clear : treasureBoxdialog_lose;
      if(result) this.img.src = treasureBoxImage2.src
      this.img.src = treasureBoxImage2.src
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
      case 0:
      case 1:
      case 2:
      case 4:
      case 6:
      case 7:
      case 8:
        this.draw00();
        if ([1, 4, 6, 8].includes(this.state)) {
          this.draw_conv(this.conv_num);
        }
        if (this.state === 2) {
          drawChoiceUI(this.loc.x + 20, this.loc.y + 100, this.choice);
        }
        break;
    }
  }
}
