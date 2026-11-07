// ===============================================================
// KBÜ Not Hesaplayıcı - script.js
// Karabük Üniversitesi Lisans ve Önlisans Yönetmeliğine Göre
// ===============================================================

// DOM Elemanları
const notForm = document.getElementById("notForm");
const vizeInput = document.getElementById("vizeNotu");
const calismaInput = document.getElementById("calismaNotu");
const finalInput = document.getElementById("finalNotu");
const butunlemeInput = document.getElementById("butunlemeNotu");
const sinavaGirdiSelect = document.getElementById("sinavaGirdi");
const devamsizCheck = document.getElementById("devamsizCheck");
const finalHelper = document.getElementById("finalHelper");

const btnSifirla = document.getElementById("btnSifirla");
const hataKutusu = document.getElementById("hataKutusu");

const sonucKarti = document.getElementById("sonucKarti");
const durumBadge = document.getElementById("durumBadge");
const sonucBasariNotu = document.getElementById("sonucBasariNotu");
const sonucHarfNotu = document.getElementById("sonucHarfNotu");
const sonucKatsayi = document.getElementById("sonucKatsayi");
const sonucSinavTuru = document.getElementById("sonucSinavTuru");
const sonucAciklama = document.getElementById("sonucAciklama");

// ---------------------------------------------------------------
// Olay Dinleyicileri (Event Listeners)
// ---------------------------------------------------------------

// Form gönderildiğinde (veya Enter tuşuna basıldığında) hesapla
notForm.addEventListener("submit", function (e) {
    e.preventDefault();
    hesapla();
});

// Sıfırla butonuna tıklandığında her şeyi temizle
btnSifirla.addEventListener("click", function () {
    formuSifirla();
});

// Bütünleme girildiğinde final alanını otomatik olarak devre dışı bırak
butunlemeInput.addEventListener("input", function () {
    if (this.value.trim() !== "") {
        finalInput.disabled = true;
        finalInput.classList.remove("is-invalid");
        finalHelper.textContent = "Bütünleme girildiği için final devre dışı bırakıldı.";
    } else {
        finalInput.disabled = false;
        finalHelper.textContent = "Bütünleme girilirse devre dışı kalır";
    }
});

// Devamsızlık işaretlendiğinde veya sınav durumu değiştiğinde hataları temizle
devamsizCheck.addEventListener("change", function () {
    hatayiTemizle();
});

sinavaGirdiSelect.addEventListener("change", function () {
    hatayiTemizle();
});

// ---------------------------------------------------------------
// Ana Hesaplama Fonksiyonu
// ---------------------------------------------------------------
function hesapla() {
    hatayiTemizle();

    // 1. KURAL: Devamsızlık Kontrolü (F1)
    // Eğer devamsızım işaretliyse doğrudan F1 ile hesaplama biter
    if (devamsizCheck.checked) {
        sonucGoster({
            durum: "Kaldı",
            harf: "F1",
            katsayi: "0.00",
            basariNotu: "0.00",
            sinavTuru: "Devamsız",
            aciklama: "Devamsız olduğunuz için genel/bütünleme sınav hakkınız bulunmamaktadır (F1)."
        });
        return;
    }

    // 2. KURAL: Sınava Katılım Kontrolü (F2)
    // Devam var fakat sınava girilmemişse doğrudan F2 ile hesaplama biter
    if (sinavaGirdiSelect.value === "hayir") {
        sonucGoster({
            durum: "Kaldı",
            harf: "F2",
            katsayi: "0.00",
            basariNotu: "0.00",
            sinavTuru: "Sınava Girilmedi",
            aciklama: "Genel veya bütünleme sınavına girmediğiniz için dersten kaldınız (F2)."
        });
        return;
    }

    // 3. Girdi Doğrulama (Validation)
    const vizeVal = vizeInput.value.trim();
    const calismaVal = calismaInput.value.trim();
    const finalVal = finalInput.value.trim();
    const butunlemeVal = butunlemeInput.value.trim();

    // Vize notu kontrolü
    if (vizeVal === "") {
        hataGoster("Lütfen Vize / Ara Sınav notunu giriniz.", vizeInput);
        return;
    }
    const vize = parseFloat(vizeVal);
    if (isNaN(vize) || vize < 0 || vize > 100) {
        hataGoster("Vize notu 0 ile 100 arasında geçerli bir sayı olmalıdır.", vizeInput);
        return;
    }

    // Yıl içi çalışma notu kontrolü (opsiyonel)
    let calisma = null;
    if (calismaVal !== "") {
        calisma = parseFloat(calismaVal);
        if (isNaN(calisma) || calisma < 0 || calisma > 100) {
            hataGoster("Yıl içi çalışma notu 0 ile 100 arasında bir sayı olmalıdır.", calismaInput);
            return;
        }
    }

    // Sınav notu belirleme: Bütünleme girilmişse bütünleme, girilmemişse final
    let sinavNotu = 0;
    let sinavTuruMetni = "";

    if (butunlemeVal !== "") {
        // Bütünleme girilmiş
        const butunleme = parseFloat(butunlemeVal);
        if (isNaN(butunleme) || butunleme < 0 || butunleme > 100) {
            hataGoster("Bütünleme notu 0 ile 100 arasında geçerli bir sayı olmalıdır.", butunlemeInput);
            return;
        }
        sinavNotu = butunleme;
        sinavTuruMetni = "Bütünleme (" + sinavNotu + ")";
    } else {
        // Bütünleme girilmemişse final zorunludur
        if (finalVal === "") {
            hataGoster("Final notu gereklidir (veya Bütünleme notu giriniz).", finalInput);
            return;
        }
        const finalNot = parseFloat(finalVal);
        if (isNaN(finalNot) || finalNot < 0 || finalNot > 100) {
            hataGoster("Final notu 0 ile 100 arasında geçerli bir sayı olmalıdır.", finalInput);
            return;
        }
        sinavNotu = finalNot;
        sinavTuruMetni = "Final (" + sinavNotu + ")";
    }

    // 4. Yıl İçi Puanının Hesaplanması
    // Çalışma girilmemişse vize doğrudan yıl içi kabul edilir.
    // Çalışma girilmişse %70 Vize + %30 Çalışma şeklinde hesaplanır.
    let yilIci = vize;
    if (calisma !== null) {
        yilIci = (vize * 0.70) + (calisma * 0.30);
    }

    // 5. Başarı Notu Hesaplama (Yıl İçi %40 + Genel/Büt %60)
    const basari = (yilIci * 0.40) + (sinavNotu * 0.60);
    const basariYuvarlanmis = parseFloat(basari.toFixed(2));

    // 6. Geçme / Kalma ve Harf Notu Kontrolü
    // Koşul (i): Genel/Bütünleme sınav notu >= 50 olmalıdır.
    // Koşul (ii): Ders başarı notu >= 60 olmalıdır.

    if (sinavNotu < 50) {
        sonucGoster({
            durum: "Kaldı",
            harf: "F3",
            katsayi: "0.00",
            basariNotu: basariYuvarlanmis.toFixed(2),
            sinavTuru: sinavTuruMetni,
            aciklama: "Sınav notunuz (" + sinavNotu + ") 50'nin altında olduğu için F3 (Kaldı)."
        });
        return;
    }

    if (basariYuvarlanmis < 60) {
        sonucGoster({
            durum: "Kaldı",
            harf: "F3",
            katsayi: "0.00",
            basariNotu: basariYuvarlanmis.toFixed(2),
            sinavTuru: sinavTuruMetni,
            aciklama: "Ders başarı notunuz (" + basariYuvarlanmis.toFixed(2) + ") 60'ın altında olduğu için F3 (Kaldı)."
        });
        return;
    }

    // Her iki koşul da sağlandı -> Harf notu aralığını belirle
    const harfBilgisi = harfNotuBelirle(basariYuvarlanmis);

    sonucGoster({
        durum: "Geçti",
        harf: harfBilgisi.harf,
        katsayi: harfBilgisi.katsayi,
        basariNotu: basariYuvarlanmis.toFixed(2),
        sinavTuru: sinavTuruMetni,
        aciklama: harfBilgisi.harf + ", Geçti (koşullar sağlandı)."
    });
}

// ---------------------------------------------------------------
// KBÜ Harf Notu ve Katsayı Aralıkları
// ---------------------------------------------------------------
function harfNotuBelirle(not) {
    if (not >= 90) {
        return { harf: "A1", katsayi: "4.00" };
    } else if (not >= 80) {
        return { harf: "A2", katsayi: "3.50" };
    } else if (not >= 70) {
        return { harf: "B1", katsayi: "3.00" };
    } else if (not >= 65) {
        return { harf: "B2", katsayi: "2.75" };
    } else {
        return { harf: "C", katsayi: "2.50" };
    }
}

// ---------------------------------------------------------------
// DOM Güncelleme ve Sonuç Gösterme
// ---------------------------------------------------------------
function sonucGoster(veri) {
    sonucBasariNotu.textContent = veri.basariNotu;
    sonucHarfNotu.textContent = veri.harf;
    sonucKatsayi.textContent = veri.katsayi;
    sonucSinavTuru.textContent = veri.sinavTuru;
    sonucAciklama.textContent = veri.aciklama;

    // Geçti/Kaldı stil sınıfları ve rozet
    if (veri.durum === "Geçti") {
        durumBadge.textContent = "Geçti";
        durumBadge.className = "badge badge-gecti";
        sonucKarti.className = "sonuc-karti gecen";
    } else {
        durumBadge.textContent = "Kaldı (" + veri.harf + ")";
        durumBadge.className = "badge badge-kaldi";
        sonucKarti.className = "sonuc-karti kalan";
    }

    sonucKarti.style.display = "block";
    sonucKarti.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ---------------------------------------------------------------
// Hata Mesajı Gösterme ve Temizleme
// ---------------------------------------------------------------
function hataGoster(mesaj, inputElemani) {
    hataKutusu.textContent = mesaj;
    hataKutusu.style.display = "block";
    sonucKarti.style.display = "none";

    if (inputElemani) {
        inputElemani.classList.add("is-invalid");
        inputElemani.focus();
    }
}

function hatayiTemizle() {
    hataKutusu.style.display = "none";
    hataKutusu.textContent = "";

    const inputs = document.querySelectorAll(".is-invalid");
    inputs.forEach(function (input) {
        input.classList.remove("is-invalid");
    });
}

// ---------------------------------------------------------------
// Form Sıfırlama
// ---------------------------------------------------------------
function formuSifirla() {
    notForm.reset();
    finalInput.disabled = false;
    finalHelper.textContent = "Bütünleme girilirse devre dışı kalır";
    hatayiTemizle();
    sonucKarti.style.display = "none";
    vizeInput.focus();
}
