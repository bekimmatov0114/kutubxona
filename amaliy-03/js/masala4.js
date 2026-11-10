// 4-masala. harflarniSarala(s) — harflarni alifbo tartibida joylashtirish
// Yechim: satrni harflar massiviga ajrataman (split), sort bilan tartiblayman, join bilan yana satrga yig'aman.
function harflarniSarala(s) {
  const harflar = s.split("");
  harflar.sort();
  return harflar.join("");
}

// Tekshiruvlar
console.log(harflarniSarala("javascript")); // kutilgan: "aacijprstv"
console.log(harflarniSarala("css")); // kutilgan: "css"
console.log(harflarniSarala("urganch")); // kutilgan: "acghnru" (o'z misolim)
console.log(harflarniSarala("")); // kutilgan: "" (chegaraviy holat: bo'sh satr)
