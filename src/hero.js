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
  }
    update_state(){
        if(Background.velocity.x !== 0 || Background.velocity.y !== 0){
            this.is_stopping = false
        }else{
            this.is_stopping = true
        }
        if(keys.tab.pressed){
            keys.tab.pressed = false
            this.inv.inventoryVisible = !this.inv.inventoryVisible        }
    }
    update_image() {
    if (this.is_talking || this.is_stopping) {
      this.img_num = 0;
      this.currentImage = playerImages.down;
    } else {
      this.img_num = (this.frame >> 4) % 2 + 1;
      if (Background.velocity.x < 0) {
        this.currentImage = playerImages.right;
      } else if (Background.velocity.x > 0) {
        this.currentImage = playerImages.left;
      } else if (Background.velocity.y > 0) {
        this.currentImage = playerImages.up;
      } else if (Background.velocity.y < 0) {
        this.currentImage = playerImages.down;
      }
    }
  }
    update(){
        this.frame++
        if(this.frame > 1000000) this.frame = 0;
        this.update_state()
        this.update_image()
        this.inv.updateInventoryUI()
        this.inv.display() //持ち物を表示
    }
    draw(){
        if(this.is_talking){
            this.img_num = 0
            this.img.src = playerImg_down.src
        }
    c.drawImage(
      this.currentImage,
      96 * this.img_num,
      0,
      96,
      96,
      canvas.width >> 1,
      canvas.height >> 1,
      HERO_W,
      HERO_H
    );
    }
}