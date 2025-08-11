問題サンプルを記載しておきます\
どこを穴埋めの部分にするかは任せようかなと思います\
基本それぞれのメインになる関数からいじればいいかも\
看板復元(printf)
```
#include <stdio.h>

int main() {
    // 看板の文字を表示する
    printf();  // ()内部に表示したい文章を入れる

    return 0;
}
```
草刈り(for)
```
#include <stdio.h>

int main() {
    // 草を5本刈るプログラム

    int i;
    for ( i=0 ; i<5 ; i++ ) {
        printf("草を%d本刈りました\n",i+1);
    }

    return 0;
}
```
5本は適当．無限ループさせるとか長い時間動かす方が自然なら5からもっと数字を増やせばいいと思う\
橋の壊れている場所を判定する(if1つ目)
```
#include <stdio.h>

int main() {
    int bridge[] = {2, 2, 1, 0, 2, 1, 0, 2};
    int n = sizeof(bridge) / sizeof(bridge[0]);

    for (int i = 0; i < n; i++) {
        if (bridge[i] == 0) {
            printf("橋の%d番目 → 完全に壊れています！危険！\n", i);
        } else if (bridge[i] == 1) {
            printf("橋の%d番目 → ヒビがあります。修理が必要です。\n", i);
        } else if (bridge[i] == 2) {
            printf("橋の%d番目 → 問題ありません。\n", i);
        }
    }

    return 0;
}
```
完全に破損=0，危険=1，安全=2として割り振っている\
橋の修理のために材料を分類する(if2つ目)
```
#include <stdio.h>

int main() {
    int materials[] = {0, 1, 3, 2, 1, 0, 4, 3, 2, 1, 4, 0};
    int n = sizeof(materials) / sizeof(materials[0]);

    int stone = 0, iron = 0, sand = 0, wood = 0, clay = 0;

    for (int i = 0; i < n; i++) {
        if (materials[i] == 0) {
            stone++;
        } else if (materials[i] == 1) {
            iron++;
        } else if (materials[i] == 2) {
            sand++;
        } else if (materials[i] == 3) {
            wood++;
        } else if (materials[i] == 4) {
            clay++;
        }
    }

    printf("石: %d個\n", stone);
    printf("鉄: %d個\n", iron);
    printf("砂: %d個\n", sand);
    printf("木: %d個\n", wood);
    printf("粘土: %d個\n", clay);

    return 0;
}
```
石=0，鉄=1，砂=2，木=3，粘土=4として割り振っている\

どっちも普通にやったら複合になったので，複合問題を別に作るのが難しい\
そもそもif文を学ぶなら，複数の例がそれぞれ分岐するのを見た方がいいので，自動的にforと複合するし，出力を行うならprintfも要する\
何か新しい別の構文を使った方がいいかも\
黒幕討伐(複合応用)
```
#include <stdio.h>

int main() {
    int i,hit;
    for (i = 0; i <= 30; i++) {
        hit = 0; 

        if (i % 2 == 0) { // 頭部の弱点
            printf("%d: 頭部に命中！\n", i);
            hit = 1;
        }
        if (i % 3 == 0) { // 胴体の弱点
            printf("%d: 胴体に命中！\n", i);
            hit = 1;
        }
        if (i % 4 == 0) { // 手の弱点
            printf("%d: 手に命中！\n", i);
            hit = 1;
        }
        if (i % 5 == 0) { // 足の弱点
            printf("%d: 足に命中！\n", i);
            hit = 1;
        }

        if (hit == 0) {
            printf("%d: 攻撃は外れた...\n", i);
        }
    }

    printf("黒幕を倒した！\n");
    return 0;
}
```
黒幕に頭部，胴体，手，足があるとして30通りの攻撃それぞれが有効だったり無効だったりするみたいな感じ\
いっぱいhitしたら倒せるよ！みたいな．複数同時に有効なこともある\
宝箱総当たり(while)
```
#include <stdio.h>

int main() {
    int code = 0;
    int answer = 3482;

    // 総当たりで正しい暗証番号を探す
    while ( code != answer ) {
        if (code == answer) {
            printf("暗証番号 %d を発見！宝箱が開いた！\n", code);
        } else {
            printf("暗証番号 %d は違いました\n", code);
        }
        code++;
    }
    return 0;
}
```
4桁暗証番号を想定\
code != answerの部分をcode <= 9999にすると全パターン網羅\
code++;が抜けると同じ場所での無限ループになる重要なポイントなので，ここは穴埋めする部分にした方がいいかも\
