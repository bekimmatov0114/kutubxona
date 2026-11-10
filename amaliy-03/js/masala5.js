// 5-masala. uzunlikBoyichaGuruhla(sozlar) — so'zlarni uzunligi bo'yicha guruhlash
// Yechim: har bir so'zning uzunligini kalit qilaman; shu kalit hali yo'q bo'lsa bo'sh massiv ochaman, so'zni unga qo'shaman.
function uzunlikBoyichaGuruhla(sozlar) {
  const guruhlar = {};
  for (const soz of sozlar) {
    const uzunlik = soz.length;
    if (!guruhlar[uzunlik]) {
      guruhlar[uzunlik] = [];
    }
    guruhlar[uzunlik].push(soz);
  }
  return guruhlar;
}

// Tekshiruvlar
console.log(uzunlikBoyichaGuruhla(["olma", "nok", "uzum", "anor", "gilos"])); // kutilgan: { 3: ["nok"], 4: ["olma", "uzum", "anor"], 5: ["gilos"] }
console.log(uzunlikBoyichaGuruhla(["web", "css", "html"])); // kutilgan: { 3: ["web", "css"], 4: ["html"] } (o'z misolim)
console.log(uzunlikBoyichaGuruhla(["salom"])); // kutilgan: { 5: ["salom"] } (chegaraviy holat: bitta element)
console.log(uzunlikBoyichaGuruhla([])); // kutilgan: {} (chegaraviy holat: bo'sh massiv)
