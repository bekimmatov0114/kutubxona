// 3-masala. massivniTeskari(arr) — massivni teskari tartibda qaytarish
// Yechim: yangi bo'sh massiv ochib, asl massivni oxiridan boshiga qarab aylanaman va elementlarni push qilaman.
function massivniTeskari(arr) {
  const natija = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    natija.push(arr[i]);
  }
  return natija;
}

// Tekshiruvlar
console.log(massivniTeskari([1, 2, 3, 4])); // kutilgan: [4, 3, 2, 1]
console.log(massivniTeskari(["a", "b"])); // kutilgan: ["b", "a"]
console.log(massivniTeskari([10, 20, 30, 40, 50])); // kutilgan: [50, 40, 30, 20, 10] (o'z misolim)
console.log(massivniTeskari([])); // kutilgan: [] (chegaraviy holat: bo'sh massiv)
console.log(massivniTeskari([7])); // kutilgan: [7] (chegaraviy holat: bitta element)
