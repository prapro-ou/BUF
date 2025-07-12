//
//npc用のクラス
//

class npc01 {
    constructor({namae, location, image}){
    this.name = namae;
    this.loc = location;
    this.img = new Image();
    this.img_loaded = false;
    this.img.onload = () => {
        this.img_loaded = true;
    };
    this.img.src = image;
    this.is_nearest = false;
    this.state = 0;
    this.dialog = "";
    this.dialog_timer = 0;
}
    can_talk(){
        console.log("近い？" + this.is_nearest)
        if(!this.is_nearest) return false
        let dis = distance(this.loc, Hero.loc) 
        console.log(this.name + ' : '+ dis)
        if(dis < 64) return true; else return false
    }
    talk(){
    this.dialog = "こんにちは！"; // 表示するセリフ
    this.dialog_timer = 120;      // 例：2秒間表示（60FPSなら120フレーム）
    console.log(this.name + " says: " + this.dialog);
}

draw(){
    if (!this.img_loaded) return; // 読み込み前なら描画しない

    // NPCの画像を描画
    c.drawImage(
        this.img, 
        0, 0, HERO_W, HERO_H,
        this.loc.x, this.loc.y,
        HERO_W, HERO_H
    );

    // 吹き出しの描画（セリフがある場合）
    if(this.dialog_timer > 0){
        const padding = 6;
        const fontSize = 16;
        c.font = `${fontSize}px sans-serif`;
        c.fillStyle = "white";
        c.strokeStyle = "black";
        c.textAlign = "center";

        const textX = this.loc.x + HERO_W / 2;
        const textY = this.loc.y - 10;

        const textWidth = c.measureText(this.dialog).width;
        const boxWidth = textWidth + padding * 2;
        const boxHeight = fontSize + padding * 2;

        c.fillRect(textX - boxWidth / 2, textY - boxHeight, boxWidth, boxHeight);
        c.strokeRect(textX - boxWidth / 2, textY - boxHeight, boxWidth, boxHeight);

        c.fillStyle = "black";
        c.fillText(this.dialog, textX, textY - padding);

        this.dialog_timer--;
    }
}



}