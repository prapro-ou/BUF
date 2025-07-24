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
    this.choice = null  
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
draw_conv(c_num){
    if (this.state === 1) {
        // 範囲チェック（最後の文を超えないように）
        if (c_num < npc375dialog_1.length) {
            console.log(npc375dialog_1[c_num]);
        }

        // 会話が終わったら状態遷移（例：state = 2）
        if (this.conv_num >= npc375dialog_1.length) {
            this.state = 2; // 会話終了状態などに遷移
            this.conv_num = 0
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

    if (this.state === 2) {
    if (keys.a.pressed && !keys.a.wasPressed) {
        this.choice = "yes";
        keys.a.wasPressed = true;
    }
    if (keys.d.pressed && !keys.d.wasPressed) {
        this.choice = "no";
        keys.d.wasPressed = true;
    }
    if(this.choice !== null)console.log(this.choice)
    if (keys.space.pressed && !keys.space.wasPressed && this.choice !== null) {
        keys.space.wasPressed = true;
        this.state = 0; // 選択完了→終了 or クエスト受注へ
        Hero.is_talking = false;
        // クエスト受注ロジック
        if (this.choice === "yes") {
            console.log("承諾された")
            console.log("こいつのクエストに関するプログラムに遷移")
            //this.startQuest();
        } else {
            console.log("断られた！");
            this.state = 0;
        }
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
        case 2 : this.draw00();//todo後でクエストを承諾するかどうかの選択中の描画について考える
                 break;
        case 3 : this.draw00()
    }
    }
    
}