//
//
//
class npc375 extends npc01 {
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
    this.img.src = npc375Img.src;
    this.conv_num = 0
    this.state = 0
    this.frame = 0
    }
    can_talk(){
        return this.is_nearest
    }
    talk(){
        this.state = 1
    }
draw_conv(c_num){
    if (this.state === 1) {
        // 範囲チェック（最後の文を超えないように）
        if (c_num < npc375dialog_1.length) {
            console.log(npc375dialog_1[c_num]);
        }

        // 会話が終わったら状態遷移（例：state = 2）
        if (this.conv_num >= npc375dialog_1.length) {
            this.state = 0; // 会話終了状態などに遷移
            this.conv_num = 0
            Hero.is_talking = false
        }
    }
}
draw00(){
    c.drawImage(
        this.img, 
        0, 0, NPC_W, NPC_H,
        this.loc.x, this.loc.y,
        NPC_W<<1, NPC_H<<1
    );
    c.drawImage(
        wait_icon, 
        32*((this.frame >> 4) % 4) , 0, 32, 64,
        this.loc.x+16, this.loc.y,
        32, 64 
    )}
draw01(){
    c.drawImage(
        this.img, 
        96, 0, NPC_W, NPC_H,
        this.loc.x, this.loc.y,
        NPC_W<<1, NPC_H<<1
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
}
draw(){
    if (!this.img_loaded) return; // 読み込み前なら描画しない
    //NPCの画像を描画
    console.log(this.state  )
    switch (this.state){
        case 0 : this.draw00();
                 break; 
        case 1 : this.draw01();
                 break;
    }
    }
    
}