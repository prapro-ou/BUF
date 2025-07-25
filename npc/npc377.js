//
//
//
class npc377 extends npc01 {
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
    this.img.src = npc377Img.src;
    this.conv_num = 0
    this.state = 0
    this.frame = 0
    }
can_talk(){
        return this.is_nearest
}
talk(){
    if(this.state == 0){
        this.state = 1;
    }
}
draw_conv(c_num){
    if(this.state == 1){
    console.log(npc377dialog_1[c_num])
    }
}
draw00(){
    c.drawImage(
        this.img, 
        64, 0, NPC_W, NPC_H,
        this.loc.x, this.loc.y,
        NPC_W<<1, NPC_H<<1
    );
    c.drawImage(
        wait_icon, 
        32*((this.frame >> 4) % 4) , 0, 32, 64,
        this.loc.x+16, this.loc.y,
        32, 64 
    )
}
draw01(){
    c.drawImage(
        this.img, 
        96, 0, NPC_W, NPC_H,
        this.loc.x, this.loc.y,
        NPC_W<<1, NPC_H<<1
    );
    draw_conv(this.conv_num)
}
update(){
    this.frame++
    if(this.state == 1 && keys.space.pressed) this.conv_num++
}
draw(){
    if (!this.img_loaded) return; // 読み込み前なら描画しない
    //NPCの画像を描画
    switch (this.state){
        case 0 : this.draw00();
                 break; 
        case 1 : this.draw01();
                 break;
    }
    }
    
}