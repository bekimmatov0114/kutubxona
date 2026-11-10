// 1-masala. mukammalSon(n) — son mukammal ekanini tekshirish
// Yechim: 1 dan n/2 gacha sonlarni aylanib, n ga qoldiqsiz bo'linadiganlarini qo'shaman. Yig'indi n ga teng bo'lsa true.
function mukammalSon(n) {
  let yigindi = 0;
  for (let i = 1; i <= n / 2; i++) {
    if (n % i === 0) {
      yigindi += i;
    }
  }
  return yigindi === n;
}

// Tekshiruvlar
console.log(mukammalSon(28)); // kutilgan: true
console.log(mukammalSon(12)); // kutilgan: false
console.log(mukammalSon(6)); // kutilgan: true (o'z misolim)
console.log(mukammalSon(496)); // kutilgan: true (o'z misolim)
console.log(mukammalSon(1)); // kutilgan: false (chegaraviy holat)
