//
//npc用のクラス
//

class npc01 {
    constructor({npc_num, location}){
    this.num = npc_num;
    this.loc = location;
    this.is_nearest = false
    this.img = new Image();
    this.img_loaded = false;
    this.img.onload = () => {
        this.img_loaded = true;
    };
    this.state = 0
    this.frame = 0
    }
    can_talk(){
        return this.is_nearest
    }
    talk(){
        
    }
draw00(){
    c.drawImage(
        this.img, 
        0, 0, NPC_W, NPC_H,
        this.loc.x, this.loc.y,
        NPC_W, NPC_H
    );
    c.drawImage(
        wait_icon, 
        32*((this.frame >> 4) % 4) , 0, 32, 64,
        this.loc.x+16, this.loc.y,
        32, 64 
    )}

draw(){
    this.frame++
    if (!this.img_loaded) return; // 読み込み前なら描画しない
    //NPCの画像を描画
    switch (this.state){
        case 0 : this.draw00();
                 break; 
    }
    }
}
