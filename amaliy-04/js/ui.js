// js/ui.js — umumiy komponentlar: band qilish (hisoblagich + localStorage), modal oyna, forma tekshiruvi

const KALIT_BAND = "kutubxona_bandlar";

// ---------- localStorage yordamchilari ----------
function localdanOqi(kalit, boshlangich) {
  try {
    const matn = localStorage.getItem(kalit);
    return matn === null ? boshlangich : JSON.parse(matn);
  } catch (xato) {
    return boshlangich;
  }
}

function localgaYoz(kalit, qiymat) {
  try {
    localStorage.setItem(kalit, JSON.stringify(qiymat));
  } catch (xato) {
    // localStorage ishlamasa, sayt baribir ishlayveradi
  }
}

// ---------- Band qilish ----------
let bandIdlar = localdanOqi(KALIT_BAND, []);
if (!Array.isArray(bandIdlar)) {
  bandIdlar = [];
}

function bandQilinganmi(id) {
  return bandIdlar.includes(id);
}

function bandHisoblagichniYangila() {
  document.querySelectorAll("#band-soni").forEach((el) => {
    el.textContent = bandIdlar.length;
  });
}

// Kitob band qilingan bo'lsa bekor qiladi, aks holda band qiladi
function bandniOzgartir(id) {
  if (bandQilinganmi(id)) {
    bandIdlar = bandIdlar.filter((x) => x !== id);
  } else {
    bandIdlar.push(id);
  }
  localgaYoz(KALIT_BAND, bandIdlar);
  bandHisoblagichniYangila();
  document.dispatchEvent(new CustomEvent("band-ozgardi"));
}

// ---------- Modal oyna ----------
let modalFon = null;
let modalIchki = null;
let modalYopishTugma = null;
let oxirgiFokus = null;

function modalQur() {
  modalFon = document.createElement("div");
  modalFon.className = "modal-fon";
  modalFon.hidden = true;

  const oyna = document.createElement("div");
  oyna.className = "modal";
  oyna.setAttribute("role", "dialog");
  oyna.setAttribute("aria-modal", "true");

  modalYopishTugma = document.createElement("button");
  modalYopishTugma.className = "modal-yopish";
  modalYopishTugma.type = "button";
  modalYopishTugma.textContent = "×";
  modalYopishTugma.setAttribute("aria-label", "Yopish");

  modalIchki = document.createElement("div");

  oyna.append(modalYopishTugma, modalIchki);
  modalFon.append(oyna);
  document.body.append(modalFon);

  modalYopishTugma.addEventListener("click", modalYop);
  // Fon ustiga bosilganda yopiladi (oyna ichiga bosilganda emas)
  modalFon.addEventListener("click", (e) => {
    if (e.target === modalFon) {
      modalYop();
    }
  });
}

function modalOch(...tugunlar) {
  if (modalFon.hidden) {
    oxirgiFokus = document.activeElement;
  }
  modalIchki.replaceChildren(...tugunlar);
  modalFon.hidden = false;
  document.body.classList.add("modal-ochiq");
  modalYopishTugma.focus();
}

function modalYop() {
  if (!modalFon || modalFon.hidden) {
    return;
  }
  modalFon.hidden = true;
  document.body.classList.remove("modal-ochiq");
  if (oxirgiFokus) {
    oxirgiFokus.focus();
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modalYop();
  }
});

// ---------- Forma tekshiruvi (aloqa.html) ----------
function bugunSanasi() {
  const hozir = new Date();
  const yil = hozir.getFullYear();
  const oy = String(hozir.getMonth() + 1).padStart(2, "0");
  const kun = String(hozir.getDate()).padStart(2, "0");
  return yil + "-" + oy + "-" + kun;
}

// Har bir maydon uchun tekshiruv: xato matnini qaytaradi, to'g'ri bo'lsa bo'sh satr
const tekshiruvlar = {
  fullname: (input) => {
    const qiymat = input.value.trim();
    if (qiymat === "") return "F.I.Sh ni kiriting.";
    if (qiymat.length < 5 || !qiymat.includes(" ")) return "Ism va familiyani to'liq kiriting.";
    return "";
  },
  email: (input) => {
    const qiymat = input.value.trim();
    if (qiymat === "") return "Email manzilini kiriting.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(qiymat)) return "Email formati noto'g'ri (masalan: talaba@urdu.uz).";
    return "";
  },
  phone: (input) => {
    const qiymat = input.value.trim();
    if (qiymat === "") return "Telefon raqamini kiriting.";
    if (!/^\+998\d{9}$/.test(qiymat)) return "Telefon +998XXXXXXXXX ko'rinishida bo'lsin.";
    return "";
  },
  count: (input) => {
    const son = Number(input.value);
    if (input.value.trim() === "") return "Nusxalar sonini kiriting.";
    if (!Number.isInteger(son) || son < 1 || son > 5) return "Nusxalar soni 1 dan 5 gacha bo'lsin.";
    return "";
  },
  date: (input) => {
    if (input.value === "") return "Olish sanasini tanlang.";
    if (input.value < bugunSanasi()) return "O'tgan sanani tanlab bo'lmaydi.";
    return "";
  },
  "book-select": (input) => {
    return input.value === "" ? "Kitobni tanlang." : "";
  },
  comments: (input) => {
    return input.value.trim().length > 300 ? "Izoh 300 ta belgidan oshmasin." : "";
  },
  terms: (input) => {
    return input.checked ? "" : "Qoidalarga rozilik bildiring.";
  },
};

function maydonniTekshir(id) {
  const input = document.querySelector("#" + id);
  const xatoEl = document.querySelector("#" + id + "-xato");
  const xatoMatni = tekshiruvlar[id](input);
  xatoEl.textContent = xatoMatni;
  input.classList.toggle("xato-maydon", xatoMatni !== "");
  input.setAttribute("aria-invalid", String(xatoMatni !== ""));
  return xatoMatni === "";
}

const bandForma = document.querySelector("#band-forma");
if (bandForma) {
  const muvaffaqiyatEl = document.querySelector("#muvaffaqiyat");
  const kitobTanlov = document.querySelector("#book-select");
  const sanaInput = document.querySelector("#date");

  sanaInput.min = bugunSanasi();

  // Kitoblar ro'yxati data.js dan olinadi (faqat mavjudlari)
  if (typeof kitoblar !== "undefined") {
    kitoblar
      .filter((k) => k.mavjud)
      .forEach((k) => {
        const option = document.createElement("option");
        option.value = String(k.id);
        option.textContent = k.nomi + " — " + k.muallif;
        kitobTanlov.append(option);
      });
    // Katalogda band qilingan kitob bo'lsa, u oldindan tanlanadi
    const oldindan = bandIdlar.find((id) => kitobTanlov.querySelector('option[value="' + id + '"]'));
    if (oldindan !== undefined) {
      kitobTanlov.value = String(oldindan);
    }
  }

  bandForma.addEventListener("submit", (e) => {
    e.preventDefault();
    muvaffaqiyatEl.hidden = true;

    let hammasiTogri = true;
    let birinchiXato = null;
    Object.keys(tekshiruvlar).forEach((id) => {
      if (!maydonniTekshir(id)) {
        hammasiTogri = false;
        if (!birinchiXato) birinchiXato = document.querySelector("#" + id);
      }
    });

    if (!hammasiTogri) {
      birinchiXato.focus();
      return;
    }

    const ism = document.querySelector("#fullname").value.trim();
    const kitobId = Number(kitobTanlov.value);
    const kitob = typeof kitoblar !== "undefined" ? kitoblar.find((k) => k.id === kitobId) : null;

    // Tasdiqlangan kitob band qilinganlar ro'yxatiga qo'shiladi
    if (!bandQilinganmi(kitobId)) {
      bandniOzgartir(kitobId);
    }

    muvaffaqiyatEl.textContent =
      "Rahmat, " + ism + "! " + (kitob ? "«" + kitob.nomi + "»" : "Kitob") + " uchun band qilish so'rovingiz qabul qilindi.";
    muvaffaqiyatEl.hidden = false;
    bandForma.reset();
    Object.keys(tekshiruvlar).forEach((id) => {
      document.querySelector("#" + id).classList.remove("xato-maydon");
    });
  });

  // Foydalanuvchi tuzatayotganda xato shu zahoti yangilanadi
  Object.keys(tekshiruvlar).forEach((id) => {
    const input = document.querySelector("#" + id);
    const yangilash = () => {
      if (input.classList.contains("xato-maydon")) {
        maydonniTekshir(id);
      }
    };
    input.addEventListener("input", yangilash);
    input.addEventListener("change", yangilash);
  });
}

modalQur();
bandHisoblagichniYangila();
