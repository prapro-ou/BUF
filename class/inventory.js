//
//プレイヤーの持ち物を管理するクラス
class inventory {
    constructor() {
        this.items = []; // 持ち物の配列
        this.inventoryVisible = false
    }

    // アイテムを追加するメソッド
    addItem(item) {
      buy_item.currentTime = 0; // 最初から再生
      buy_item.volume = 0.5
      buy_item.play();
  const existing = this.items.find(i => i.name === item.name)
  if (existing) {
    existing.count += item.count || 1 // countが指定されていなければ+1
  } else {
    // countが指定されていない場合は1にする
    this.items.push({
      name: item.name,
      count: item.count || 1,
      description: item.description || ""
    })
  }
}
// has(itemName) {
//     return this.items.includes(itemName);
//   }

removeItem(item) {
  const existing = this.items.find(i => i.name === item.name)
  if (!existing) {
    console.warn(`Item "${item.name}" not found in inventory.`)
    return
  }
  else {
    existing.count -= item.count || 1
    if (existing.count <= 0) {
      this.items.splice(existing, 1) // 0以下になったら削除
    }
  }
}

    updateInventoryUI() {
    const list = document.getElementById("inventory-list")
    list.innerHTML = "" // 一度リストを空にする

    this.items.forEach(item => {
        const li = document.createElement("li")
        li.textContent = item.name + " x " + item.count + " (" + item.description + ")"
        list.appendChild(li)
    })
}
    // 持ち物を表示するメソッド
    display() {
        document.getElementById("inventory").style.display = this.inventoryVisible ? "block" : "none"    }
}