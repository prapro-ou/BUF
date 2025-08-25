//
//通常ステージの主人公子クラス
//
class hero extends human {
  constructor({ location, image }) {
    super({ location, image });
    this.loc = location;
    this.img_num = 0;
    this.frame = 0;
    this.is_stopping = true;
    this.inv = new inventory();
    this.is_talking = false;
    this.currentImage = playerImages.down; // 初期画像
    this.coin = 0
    this.hasFor = false
    this.hasIf = false;
    this.hasWhile = false;
    this.hasSwitch = false;
    this.hasBreak = false;
    this.direction_row = 0; // 向きの行番号（0:下, 1:右, 2:左, 3:上）
  }
    update_state(){
        if(Background.velocity.x !== 0 || Background.velocity.y !== 0){
            this.is_stopping = false
        }else{
            this.is_stopping = true
        }
            if(keys.tab.pressed){
                keys.tab.pressed = false
                this.inv.inventoryVisible = !this.inv.inventoryVisible
                this.is_talking = !this.is_talking
              }
    }
update_image() {
  if (this.is_talking || this.is_stopping) {
    this.img_num = 0;
    this.direction_row = 0; // 下向き
  } else {
    this.img_num = (this.frame >> 4) % 2 + 1; // 0〜2のアニメーション番号
    if (Background.velocity.x < 0) {
      this.direction_row = 1; // 右向き（2行目）
    } else if (Background.velocity.x > 0) {
      this.direction_row = 2; // 左向き（3行目）
    } else if (Background.velocity.y > 0) {
      this.direction_row = 3; // 上向き（4行目）
    } else if (Background.velocity.y < 0) {
      this.direction_row = 0; // 下向き（1行目）
    }
  }
}

    update() {
  this.frame++;
  if (this.frame > 1000000) this.frame = 0;

  // UI表示中は移動処理だけ止める
  const isUIBlocking = this.inv.inventoryVisible || isInShop || this.is_talking;

  if (!isUIBlocking) {
    this.update_state(); // ← 移動状態更新
  } else {
    resetMovementKeys(); // ← 強制的に移動を止める
    this.is_stopping = true;
  }

  this.update_image(); // ← 画像は常に更新
  this.inv.updateInventoryUI();
  this.inv.display();
}
    draw() {
  if (this.img_num === 2) {
    walk_sound.currentTime = 0;
    walk_sound.volume = 0.1;
    walk_sound.play();
  }

  c.drawImage(
    heroImage, // ← 統合された画像
    96 * this.img_num, // x座標（列）
    96 * this.direction_row, // y座標（行）
    96,
    96,
    canvas.width >> 1,
    canvas.height >> 1,
    HERO_W,
    HERO_H
  );
}

}