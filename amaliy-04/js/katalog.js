// js/katalog.js — kartalarni chiqarish, qidiruv, filtr, saralash, statistika, modal ma'lumotlari

const konteyner = document.querySelector("#kitoblar");
const qidiruv = document.querySelector("#qidiruv");
const kategoriyaTanlov = document.querySelector("#kategoriya");
const saralashTanlov = document.querySelector("#saralash");
const soni = document.querySelector("#soni");
const topilmadi = document.querySelector("#topilmadi");
const bandlarimTugma = document.querySelector("#bandlarim-tugma");

// 15000 -> "15 000 so'm"
function narxMatni(narx) {
  return String(narx).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
}

// ---------- A qism: statistika (reduce, filter, find) ----------
function statistikaniChiqar() {
  const jami = kitoblar.length;
  const mavjudlar = kitoblar.filter((k) => k.mavjud).length;
  const narxlarYigindisi = kitoblar.reduce((yigindi, k) => yigindi + k.narx, 0);
  const ortacha = Math.round(narxlarYigindisi / jami);
  const engYuqoriNarx = kitoblar.reduce((katta, k) => (k.narx > katta ? k.narx : katta), 0);
  const engQimmat = kitoblar.find((k) => k.narx === engYuqoriNarx);

  document.querySelector("#stat-jami").textContent = jami;
  document.querySelector("#stat-mavjud").textContent = mavjudlar;
  document.querySelector("#stat-ortacha").textContent = narxMatni(ortacha);
  document.querySelector("#stat-eng").textContent = engQimmat.nomi;
}

// ---------- Janr filtrini ma'lumotdan to'ldirish (map) ----------
function kategoriyalarniToldir() {
  const noyob = [...new Set(kitoblar.map((k) => k.kategoriya))];
  noyob.forEach((nom) => {
    const option = document.createElement("option");
    option.value = nom;
    option.textContent = nom;
    kategoriyaTanlov.append(option);
  });
}

// Band tugmasining matni va holatini kitobga qarab belgilaydi
function bandTugmasiniSozla(tugma, kitob) {
  if (bandQilinganmi(kitob.id)) {
    tugma.textContent = "Bandni bekor qilish";
    tugma.disabled = false;
  } else if (!kitob.mavjud) {
    tugma.textContent = "Mavjud emas";
    tugma.disabled = true;
  } else {
    tugma.textContent = "Band qilish";
    tugma.disabled = false;
  }
}

// ---------- B qism: karta yaratish ----------
function kartaYarat(kitob) {
  const karta = document.createElement("article");
  karta.className = "book-card";
  karta.dataset.id = kitob.id;

  const yuqori = document.createElement("div");

  const rasm = document.createElement("img");
  rasm.className = "book-img";
  rasm.src = kitob.rasm;
  rasm.alt = kitob.nomi + " muqovasi";
  rasm.loading = "lazy";

  const h3 = document.createElement("h3");
  h3.className = "book-card-title";
  h3.textContent = kitob.nomi;

  const muallif = document.createElement("p");
  muallif.className = "book-card-author";
  muallif.textContent = kitob.muallif;

  const meta = document.createElement("p");
  meta.className = "book-meta";
  meta.textContent = kitob.kategoriya + " · " + kitob.teglar.join(", ");

  const narx = document.createElement("p");
  narx.className = "book-price";
  narx.textContent = narxMatni(kitob.narx);

  const holat = document.createElement("span");
  holat.className = kitob.mavjud ? "status-available" : "status-reserved";
  holat.textContent = kitob.mavjud ? "Mavjud" : "Band qilingan";

  yuqori.append(rasm, h3, muallif, meta, narx, holat);

  const tugmalar = document.createElement("div");
  tugmalar.className = "card-actions";

  const batafsil = document.createElement("button");
  batafsil.type = "button";
  batafsil.className = "btn-card";
  batafsil.dataset.amal = "batafsil";
  batafsil.textContent = "Batafsil";

  const band = document.createElement("button");
  band.type = "button";
  band.className = "btn-band";
  band.dataset.amal = "band";
  bandTugmasiniSozla(band, kitob);

  tugmalar.append(batafsil, band);
  karta.append(yuqori, tugmalar);
  return karta;
}

function chiqar(royxat) {
  konteyner.innerHTML = "";
  royxat.forEach((kitob) => {
    konteyner.append(kartaYarat(kitob));
  });
  soni.textContent = royxat.length;
  topilmadi.hidden = royxat.length !== 0;
}

// ---------- Saralash (asl massivga tegmaslik uchun nusxa olinadi) ----------
function saralash(royxat, usul) {
  const nusxa = [...royxat];
  if (usul === "narx-osish") {
    nusxa.sort((a, b) => a.narx - b.narx);
  } else if (usul === "narx-kamayish") {
    nusxa.sort((a, b) => b.narx - a.narx);
  } else if (usul === "nom-az") {
    nusxa.sort((a, b) => a.nomi.localeCompare(b.nomi, "uz"));
  }
  return nusxa;
}

// Qidiruv, filtr va saralash birgalikda ishlaydi
function yangila() {
  const soz = qidiruv.value.trim().toLowerCase();
  const kategoriya = kategoriyaTanlov.value;

  let royxat = kitoblar.filter((k) => {
    const qidiruvgaMos = k.nomi.toLowerCase().includes(soz) || k.muallif.toLowerCase().includes(soz);
    const kategoriyaMos = kategoriya === "hammasi" || k.kategoriya === kategoriya;
    return qidiruvgaMos && kategoriyaMos;
  });
  royxat = saralash(royxat, saralashTanlov.value);
  chiqar(royxat);
}

// ---------- C qism: modal ----------
function malumotQatori(dl, nom, qiymat) {
  const dt = document.createElement("dt");
  dt.textContent = nom;
  const dd = document.createElement("dd");
  dd.textContent = qiymat;
  dl.append(dt, dd);
}

function kitobModalOch(kitob) {
  const quti = document.createElement("div");
  quti.className = "modal-kitob";

  const rasm = document.createElement("img");
  rasm.src = kitob.rasm;
  rasm.alt = kitob.nomi + " muqovasi";

  const matn = document.createElement("div");
  matn.className = "modal-matn";

  const h2 = document.createElement("h2");
  h2.textContent = kitob.nomi;

  const tavsif = document.createElement("p");
  tavsif.textContent = kitob.tavsif;

  const dl = document.createElement("dl");
  malumotQatori(dl, "Muallif", kitob.muallif);
  malumotQatori(dl, "Janr", kitob.kategoriya);
  malumotQatori(dl, "Yil", kitob.yil);
  malumotQatori(dl, "Narxi", narxMatni(kitob.narx));
  malumotQatori(dl, "Holati", kitob.mavjud ? "Mavjud" : "Band qilingan");
  malumotQatori(dl, "Teglar", kitob.teglar.join(", "));

  const band = document.createElement("button");
  band.type = "button";
  band.className = "btn-band";
  band.style.padding = "10px 18px";
  bandTugmasiniSozla(band, kitob);
  band.addEventListener("click", () => {
    bandniOzgartir(kitob.id);
    bandTugmasiniSozla(band, kitob);
  });

  matn.append(h2, tavsif, dl, band);
  quti.append(rasm, matn);
  modalOch(quti);
}

// "Band qilinganlarim" ro'yxati
function bandlarModalOch() {
  const quti = document.createElement("div");
  const h2 = document.createElement("h2");
  h2.textContent = "Band qilingan kitoblar";
  quti.append(h2);

  const bandKitoblar = kitoblar.filter((k) => bandQilinganmi(k.id));
  if (bandKitoblar.length === 0) {
    const p = document.createElement("p");
    p.textContent = "Hali kitob band qilinmagan.";
    quti.append(p);
  } else {
    const ul = document.createElement("ul");
    ul.className = "band-royxat";
    bandKitoblar.forEach((kitob) => {
      const li = document.createElement("li");
      const nom = document.createElement("span");
      nom.textContent = kitob.nomi + " — " + kitob.muallif;
      const bekor = document.createElement("button");
      bekor.type = "button";
      bekor.className = "btn-card";
      bekor.style.marginTop = "0";
      bekor.textContent = "Bekor qilish";
      bekor.addEventListener("click", () => {
        bandniOzgartir(kitob.id);
        bandlarModalOch();
      });
      li.append(nom, bekor);
      ul.append(li);
    });
    quti.append(ul);
  }
  modalOch(quti);
}

// ---------- Event delegation: bitta tinglovchi ota konteynerda ----------
konteyner.addEventListener("click", (e) => {
  const tugma = e.target.closest("button[data-amal]");
  if (!tugma) {
    return;
  }
  const karta = tugma.closest(".book-card");
  const kitob = kitoblar.find((k) => k.id === Number(karta.dataset.id));

  if (tugma.dataset.amal === "batafsil") {
    kitobModalOch(kitob);
  } else if (tugma.dataset.amal === "band") {
    bandniOzgartir(kitob.id);
  }
});

// ---------- Hodisalar ----------
qidiruv.addEventListener("input", yangila);
kategoriyaTanlov.addEventListener("change", yangila);
saralashTanlov.addEventListener("change", yangila);
bandlarimTugma.addEventListener("click", bandlarModalOch);
// Band holati o'zgarganda kartalardagi tugmalar yangilanadi
document.addEventListener("band-ozgardi", yangila);

// ---------- Ishga tushirish ----------
statistikaniChiqar();
kategoriyalarniToldir();
yangila();
