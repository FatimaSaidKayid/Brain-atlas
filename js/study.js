function renderPage() {
    const cart = getCart();
    document.getElementById("cart-items").innerHTML = cart.length ? cart.map(i => {
        const p = findProduct(i.id);
        return `<div class="col-md-6"><div class="cart-item">
            <img src="${p.image}" alt="${p.name}">
            <div>
                <h6>${p.name}</h6>
                <p>Category: ${p.category}</p>
                <p>Study Time: ${p.minutes * i.qty} min</p>
                <button class="qty-btn" onclick="cQty(${p.id}, -1)">-</button>
                <span class="mx-1">${i.qty}</span>
                <button class="qty-btn" onclick="cQty(${p.id}, 1)">+</button>
                <button class="btn btn-danger btn-sm ml-4" onclick="cRemove(${p.id})">Remove from List</button>
            </div></div></div>`;
    }).join("") : '<p class="text-center text-muted w-100">Your study list is empty.</p>';

    const total = cart.reduce((s, i) => s + findProduct(i.id).minutes * i.qty, 0);
    const h = Math.floor(total / 60), m = total % 60;
    document.getElementById("total-price").textContent =
        "Total Study Time: " + total + " min" + (h ? " (" + h + "h " + m + "m)" : "");

    document.getElementById("favorites").innerHTML = getFavs().map(id => {
        const p = findProduct(id);
        return `<div class="col-md-3"><div class="card fav-card">
            <img src="${p.image}" alt="${p.name}">
            <div class="p-2"><h6>${p.name}</h6><p class="mb-1 small">${p.category}</p>
            <i class="fa fa-heart fav-btn active" onclick="cFav(${p.id})"></i></div></div></div>`;
    }).join("");
}
function cQty(id, d) { changeQty(id, d); refreshPage(); }
function cRemove(id) { removeFromCart(id); refreshPage(); }
function cFav(id) { toggleFav(id); refreshPage(); }
if (requireLogin()) renderPage();
