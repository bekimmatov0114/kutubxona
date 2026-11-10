// 2-masala. qatnashganmi(matn, soz) — so'z matnda bormi
// Yechim: matn ham, so'z ham kichik harfga o'tkaziladi, keyin includes bilan qidiriladi.
function qatnashganmi(matn, soz) {
  const kichikMatn = matn.toLowerCase();
  const kichikSoz = soz.toLowerCase();
  return kichikMatn.includes(kichikSoz);
}

// Tekshiruvlar
console.log(qatnashganmi("Bugun JavaScript darsida funksiya yozdik", "javascript")); // kutilgan: true
console.log(qatnashganmi("HTML va CSS", "php")); // kutilgan: false
console.log(qatnashganmi("Urganch Davlat Universiteti", "DAVLAT")); // kutilgan: true (o'z misolim)
console.log(qatnashganmi("", "a")); // kutilgan: false (chegaraviy holat: bo'sh satr)
