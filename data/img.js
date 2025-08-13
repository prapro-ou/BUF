//
//画像読み込み用
//
const bgImage = new Image()
bgImage.src = '../img/Maps/bg_default.png'
const fgImage = new Image()
fgImage.src = '../img/Maps/fg_default.png'

const wait_icon = new Image()
wait_icon.src = '../img/effect/!.png'

const playerImg_down = new Image()
      playerImg_down.src = '../img/Character/heroDown.png'
const playerImg_up = new Image()
      playerImg_up.src = '../img/Character/heroUp.png'
const playerImg_right = new Image()
      playerImg_right.src = '../img/Character/heroRight.png'
const playerImg_left = new Image()
      playerImg_left.src = '../img/Character/heroLeft.png'

const playerImages = {
  down: new Image(),
  up: new Image(),
  left: new Image(),
  right: new Image()
};

playerImages.down.src = playerImg_down.src;
playerImages.up.src = playerImg_up.src;
playerImages.left.src = playerImg_left.src;
playerImages.right.src = playerImg_right.src;

const kanbanNpcImage = new Image()
      kanbanNpcImage.src = '../img/Character/kanbanNpc.png'