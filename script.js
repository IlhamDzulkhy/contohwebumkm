(function () {
  "use strict";
  const S = STORE;
  const $ = (id) => document.getElementById(id);
  const STORAGE_KEY = "keranjang:" + S.name;

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  const rupiah = (n) => "Rp" + n.toLocaleString("id-ID");
  const byId = {};
  S.products.forEach((p) => (byId[p.id] = p));

  /* ---------- Keranjang (id -> jumlah), disimpan di browser jika bisa ---------- */
  let cart = {};
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    Object.keys(saved).forEach((id) => {
      if (byId[id] && !byId[id].soldOut && saved[id] > 0) cart[id] = Math.min(99, Math.floor(saved[id]));
    });
  } catch (e) { cart = {}; }

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) {}
  }
  const totalQty = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = () => Object.keys(cart).reduce((a, id) => a + byId[id].price * cart[id], 0);

  /* ---------- Teks dasar ---------- */
  document.title = S.name + " | Katalog & Pesan via WhatsApp";
  $("storeName").textContent = S.name;
  $("storeTag").textContent = S.tagline;
  $("orderInfo").textContent = S.orderInfo;
  $("deliveryNote").textContent = S.deliveryNote;
  $("footName").textContent = S.name;
  $("footName2").textContent = S.name;
  $("footAddr").textContent = S.address;
  $("year").textContent = new Date().getFullYear();

  /* ---------- Filter & pencarian ---------- */
  const cats = ["Semua"].concat(S.products.map((p) => p.cat).filter((c, i, a) => a.indexOf(c) === i));
  let activeCat = "Semua";
  let query = "";

  cats.forEach((c) => {
    const b = el("button", "chip" + (c === activeCat ? " active" : ""), c);
    b.type = "button";
    b.addEventListener("click", () => {
      activeCat = c;
      document.querySelectorAll(".chip").forEach((x) => x.classList.toggle("active", x === b));
      renderGrid();
    });
    $("chips").appendChild(b);
  });
  $("search").addEventListener("input", (e) => {
    query = e.target.value.trim().toLowerCase();
    renderGrid();
  });

  /* ---------- Kontrol jumlah di kartu ---------- */
  function change(id, delta) {
    const next = Math.max(0, Math.min(99, (cart[id] || 0) + delta));
    if (next === 0) delete cart[id];
    else cart[id] = next;
    persist();
    refresh(id);
  }

  function buildControl(p) {
    const qty = cart[p.id] || 0;
    if (p.soldOut) {
      const b = el("button", "add", "Habis");
      b.disabled = true;
      return b;
    }
    if (qty === 0) {
      const b = el("button", "add", "+ Tambah");
      b.type = "button";
      b.addEventListener("click", () => change(p.id, 1));
      return b;
    }
    const wrap = el("div", "stepper");
    const minus = el("button", "", "−");
    minus.type = "button";
    minus.setAttribute("aria-label", "Kurangi " + p.name);
    minus.addEventListener("click", () => change(p.id, -1));
    const plus = el("button", "", "+");
    plus.type = "button";
    plus.setAttribute("aria-label", "Tambah " + p.name);
    plus.addEventListener("click", () => change(p.id, 1));
    const num = el("b", "", String(qty));
    num.setAttribute("aria-live", "polite");
    wrap.append(minus, num, plus);
    return wrap;
  }

  function renderGrid() {
    const grid = $("grid");
    grid.replaceChildren();
    const list = S.products.filter(
      (p) =>
        (activeCat === "Semua" || p.cat === activeCat) &&
        (!query || (p.name + " " + p.desc + " " + p.cat).toLowerCase().includes(query))
    );
    $("empty").hidden = list.length > 0;
    list.forEach((p) => {
      const card = el("article", "card" + (p.soldOut ? " sold" : ""));
      card.dataset.id = p.id;
      const thumb = el("div", "thumb", p.emoji);
      if (p.best && !p.soldOut) thumb.appendChild(el("span", "tagbest", "Favorit"));
      if (p.soldOut) thumb.appendChild(el("span", "tagsold", "Habis"));
      const body = el("div", "body");
      body.appendChild(el("h3", "", p.name));
      body.appendChild(el("p", "", p.desc));
      const price = el("div", "price", rupiah(p.price));
      price.appendChild(el("small", "", " / " + p.unit));
      body.appendChild(price);
      const slot = el("div", "slot");
      slot.appendChild(buildControl(p));
      body.appendChild(slot);
      card.append(thumb, body);
      grid.appendChild(card);
    });
  }

  /* ---------- Perbarui tampilan setelah jumlah berubah ---------- */
  function refresh(id) {
    const card = document.querySelector('.card[data-id="' + id + '"] .slot');
    if (card) card.replaceChildren(buildControl(byId[id]));
    updateBar();
    if (isOpen()) renderLines();
  }

  function updateBar() {
    const qty = totalQty();
    $("cartbar").hidden = qty === 0 && !isOpen();
    $("cartCount").textContent = qty;
    $("cartTotalBar").textContent = rupiah(totalPrice());
  }

  /* ---------- Laci keranjang ---------- */
  const drawer = $("drawer");
  const overlay = $("overlay");
  const isOpen = () => drawer.classList.contains("open");

  function openCart() {
    renderLines();
    drawer.classList.add("open");
    overlay.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("noscroll");
    $("closeCart").focus();
  }
  function closeCart() {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("noscroll");
    updateBar();
    $("openCart").focus();
  }
  $("openCart").addEventListener("click", openCart);
  $("closeCart").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && isOpen()) closeCart(); });

  function renderLines() {
    const ul = $("lines");
    ul.replaceChildren();
    const ids = Object.keys(cart);
    $("emptyCart").hidden = ids.length > 0;
    $("sum").hidden = ids.length === 0;
    $("orderForm").hidden = ids.length === 0;

    ids.forEach((id) => {
      const p = byId[id];
      const li = el("li");
      li.appendChild(el("span", "em", p.emoji));
      const nm = el("div", "nm");
      nm.appendChild(el("b", "", p.name));
      nm.appendChild(el("span", "", rupiah(p.price) + " × " + cart[id] + " = " + rupiah(p.price * cart[id])));
      li.appendChild(nm);
      const st = el("div", "stepper");
      const minus = el("button", "", "−");
      minus.type = "button";
      minus.setAttribute("aria-label", "Kurangi " + p.name);
      minus.addEventListener("click", () => change(id, -1));
      const plus = el("button", "", "+");
      plus.type = "button";
      plus.setAttribute("aria-label", "Tambah " + p.name);
      plus.addEventListener("click", () => change(id, 1));
      st.append(minus, el("b", "", String(cart[id])), plus);
      li.appendChild(st);
      ul.appendChild(li);
    });

    const total = totalPrice();
    $("cartTotal").textContent = rupiah(total);
    $("minWarn").textContent =
      S.minOrder && total > 0 && total < S.minOrder
        ? "Minimal pesanan " + rupiah(S.minOrder) + ". Tambah " + rupiah(S.minOrder - total) + " lagi ya."
        : "";
    if (ids.length === 0) $("formMsg").textContent = "";
  }

  $("clearCart").addEventListener("click", () => {
    cart = {};
    persist();
    renderGrid();
    renderLines();
    updateBar();
  });

  /* ---------- Metode: alamat hanya untuk pengantaran ---------- */
  function currentMethod() {
    return document.querySelector('input[name="method"]:checked').value;
  }
  document.querySelectorAll('input[name="method"]').forEach((r) =>
    r.addEventListener("change", () => {
      $("addrWrap").hidden = currentMethod() !== "Diantar";
    })
  );

  /* ---------- Kirim pesanan ke WhatsApp ---------- */
  $("orderForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = $("formMsg");
    const total = totalPrice();
    const name = $("fName").value.trim();
    const method = currentMethod();
    const addr = $("fAddr").value.trim();
    const when = $("fWhen").value.trim();
    const note = $("fNote").value.trim();

    if (totalQty() === 0) { msg.textContent = "Keranjang masih kosong."; return; }
    if (S.minOrder && total < S.minOrder) { msg.textContent = "Total belum mencapai minimal pesanan."; return; }
    if (!name) { msg.textContent = "Mohon isi nama kamu."; $("fName").focus(); return; }
    if (method === "Diantar" && !addr) { msg.textContent = "Mohon isi alamat pengantaran."; $("fAddr").focus(); return; }
    msg.textContent = "";

    const lines = Object.keys(cart).map((id, i) => {
      const p = byId[id];
      return (i + 1) + ". " + p.name + " x" + cart[id] + " = " + rupiah(p.price * cart[id]);
    });
    const text =
      "Halo " + S.name + ", saya mau pesan:\n\n" +
      lines.join("\n") + "\n\n" +
      "Total: " + rupiah(total) + "\n" +
      "Metode: " + method + "\n" +
      "Nama: " + name + "\n" +
      (method === "Diantar" ? "Alamat: " + addr + "\n" : "") +
      (when ? "Dibutuhkan: " + when + "\n" : "") +
      (note ? "Catatan: " + note + "\n" : "") +
      "\nTerima kasih!";

    const url = "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener");
  });

  /* ---------- Mulai ---------- */
  renderGrid();
  updateBar();
})();