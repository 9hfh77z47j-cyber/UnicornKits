(() => {
  const tg = window.Telegram && window.Telegram.WebApp;
  const catalog = window.UNICORN_CATALOG || [];
  const grid = document.getElementById("grid");
  const sheet = document.getElementById("sheet");
  const sheetPhoto = document.getElementById("sheetPhoto");
  const sheetTitle = document.getElementById("sheetTitle");
  const sheetNote = document.getElementById("sheetNote");
  const orderBtn = document.getElementById("orderBtn");
  const closeBtn = document.getElementById("closeBtn");
  let selected = null;
  let backBound = false;

  function haptic(type) {
    try {
      tg?.HapticFeedback?.impactOccurred(type || "light");
    } catch (_) {}
  }

  function applyTelegramChrome() {
    if (!tg) {
      document.body.classList.add("outside");
      return;
    }
    tg.ready();
    tg.expand();
    tg.setHeaderColor("#05070d");
    tg.setBackgroundColor("#05070d");
    if (tg.MainButton) {
      tg.MainButton.setParams({
        text: "Заказать диск",
        color: "#1d6bff",
        text_color: "#ffffff",
        is_visible: true,
        is_active: true,
      });
      tg.MainButton.onClick(() => sendOrder(selected));
    }
  }

  function markPhoto(wrap, img) {
    const fail = () => wrap.classList.add("empty");
    img.addEventListener("error", fail);
    if (img.complete && img.naturalWidth === 0) fail();
  }

  function renderGrid() {
    grid.innerHTML = catalog
      .map(
        (item) => `
      <button class="card" type="button" data-id="${item.id}">
        <div class="photo" data-photo>
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="card-meta">
          <small>${item.tag}</small>
          <strong>${item.name}</strong>
        </div>
      </button>`
      )
      .join("");

    grid.querySelectorAll(".card").forEach((card) => {
      const wrap = card.querySelector("[data-photo]");
      markPhoto(wrap, wrap.querySelector("img"));
      card.addEventListener("click", () => {
        haptic("light");
        openItem(catalog.find((x) => x.id === card.dataset.id));
      });
    });
  }

  function openItem(item) {
    if (!item) return;
    selected = item;
    sheetTitle.textContent = item.name;
    sheetNote.textContent = item.note;
    sheetPhoto.classList.remove("empty");
    sheetPhoto.innerHTML = `<img src="${item.image}" alt="${item.name}" />`;
    const img = sheetPhoto.querySelector("img");
    markPhoto(sheetPhoto, img);
    sheet.classList.add("open");
    if (tg?.BackButton) {
      tg.BackButton.show();
      if (!backBound) {
        tg.BackButton.onClick(closeSheet);
        backBound = true;
      }
    }
  }

  function closeSheet() {
    sheet.classList.remove("open");
    tg?.BackButton?.hide();
  }

  function sendOrder(item) {
    haptic("medium");
    const payload = {
      type: "order",
      shop: "UnicornKits",
      product: item ? item.id : null,
      name: item ? item.name : null,
    };
    if (tg?.sendData) {
      tg.sendData(JSON.stringify(payload));
      tg.close();
      return;
    }
    showToast("Откройте Mini App из Telegram-бота, чтобы отправить заказ.");
  }

  function showToast(text) {
    let toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  document.getElementById("contactBtn").addEventListener("click", () => {
    haptic("light");
    sendOrder(selected);
  });
  document.getElementById("catalogBtn").addEventListener("click", () => {
    haptic("light");
    closeSheet();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  orderBtn.addEventListener("click", () => sendOrder(selected));
  closeBtn.addEventListener("click", closeSheet);
  sheet.addEventListener("click", (e) => {
    if (e.target === sheet) closeSheet();
  });

  applyTelegramChrome();
  renderGrid();
})();
