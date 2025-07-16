//
//便利な関数保存用
//

//衝突しているかどうか
function iscollide(boundary){
        return (boundary.loc.x < ((canvas.width>>1) + (HERO_W) - 20)&&
                boundary.loc.x + TILE_SIZE> ((canvas.width>>1) + 20)&&
                boundary.loc.y < ((canvas.height>>1) + (HERO_H))&&
                boundary.loc.y + (TILE_SIZE>>1) > ((canvas.height>>1))+20)
    }
function iscollide(boundary){
        return (boundary.loc.x < ((canvas.width>>1) + (HERO_W) - 20)&&
                boundary.loc.x + TILE_SIZE> ((canvas.width>>1) + 20)&&
                boundary.loc.y < ((canvas.height>>1) + (HERO_H))&&
                boundary.loc.y + (TILE_SIZE>>1) > ((canvas.height>>1))+20)
    }

//プレイヤーから一番近いNPCを探索
function findNearestNPC(hero, npcList) {
    let nearestNPC = null;
    let minDist = Infinity;

    npcList.forEach(npc => {
        const dx = npc.loc.x - hero.x;
        const dy = npc.loc.y - hero.y;
        const distSquared = dx * dx + dy * dy;

        if (distSquared < minDist) {
            minDist = distSquared;
            nearestNPC = npc;
        }
    });

    npcList.forEach(npc => npc.is_nearest = false); // 全 NPC を false にリセット

    if (nearestNPC) {
        nearestNPC.is_nearest = true; // 最も近い NPC に true
    }
}

//二つの座標構造体をふけ取り２エンティティの距離を計算
function distance(locA, locB){
    const dx = locA.x - locB.x;
    const dy = locA.y - locB.y;
    return Math.sqrt(dx * dx + dy * dy); // ユークリッド距離
}
