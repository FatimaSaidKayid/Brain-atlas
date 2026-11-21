let currentList = products;

function renderPage() { renderProducts(currentList); }

function renderProducts(list) {
    const cart = getCart();
    const favs = getFavs();
    document.getElementById("no-results").style.display = list.length ? "none" : "block";
    document.getElementById("products").innerHTML = list.map(p => {
        const inCart = cart.some(i => i.id === p.id);
        return `<div class="col-md-6 col-xl-4">
            <div class="card">
                <img src="${p.image}" class="card-img-top clickable" alt="${p.name}" onclick="showDetails(${p.id})">
                <div class="card-body">
                    <h5 class="card-title clickable" onclick="showDetails(${p.id})">${p.name}</h5>
                    <p class="card-text">Function: ${p.func}</p>
                    <p class="card-text">Category: ${p.category}</p>
                    <p class="card-text">Study Time: ${p.minutes} min</p>
                    <i class="fa fa-heart fav-btn ${favs.includes(p.id) ? "active" : ""}" onclick="onFav(${p.id})"></i>
                    ${inCart
                ? `<button class="btn btn-danger btn-sm" onclick="onRemove(${p.id})">Remove from List</button>`
                : `<button class="btn btn-primary btn-sm" onclick="onAdd(${p.id})">Add to Study List</button>`}
                </div>
            </div>
        </div>`;
    }).join("");
}
function onAdd(id) { addToCart(id); refreshPage(); }
function onRemove(id) { removeFromCart(id); refreshPage(); }
function onFav(id) { toggleFav(id); refreshPage(); }

function search() {
    const type = document.getElementById("search-type").value;
    const q = document.getElementById("search-input").value.trim().toLowerCase();
    currentList = products.filter(p => (type === "name" ? p.name : p.category).toLowerCase().includes(q));
    renderProducts(currentList);
}
document.getElementById("search-btn").addEventListener("click", search);
document.getElementById("search-input").addEventListener("input", search);
document.getElementById("search-type").addEventListener("change", search);
renderProducts(currentList);

// filters coming from the Home page / Resources menu: anatomy.html?type=category&q=Lobe
(function () {
    const qs = new URLSearchParams(location.search);
    if (qs.get("q")) {
        document.getElementById("search-type").value = qs.get("type") === "category" ? "category" : "name";
        document.getElementById("search-input").value = qs.get("q");
        search();
    }
    if (location.hash === "#search") document.getElementById("search-input").focus();
})();
