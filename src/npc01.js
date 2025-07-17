//
//npc用のクラス
//

class npc01 {
    constructor({npc_num, location, image}){
    this.num = npc_num;
    this.loc = location;
    this.is_nearest = false
    this.img = new Image();
    this.img_loaded = false;
    this.img.onload = () => {
        this.img_loaded = true;
    };
    if(this.num == 375)
    this.img.src = npc375.src;
    //
    this.state = 0;
    this.dialog = "";
    this.dialog_timer = 0;
}
    can_talk(){
        console.log(this.is_nearest)
        return this.is_nearest
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
        0, 0, NPC_W, NPC_H,
        this.loc.x, this.loc.y,
        NPC_W, NPC_H
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
    } else Hero.is_talking = false
}



}