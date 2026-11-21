// ===== Brain regions data =====
const products = [
  {
    id: 1, name: "Prefrontal Cortex", category: "Frontal Lobe", minutes: 25, image: "imgs/Prefrontal Cortex.png",
    func: "Decision making & planning",
    desc: "The front-most part of the frontal lobe. It handles executive functions: planning, working memory, personality and impulse control.",
    clinical: "Injury (like the famous Phineas Gage case) changes personality and judgement. Tumors here often first appear as behavioral changes."
  },
  {
    id: 2, name: "Motor Cortex", category: "Frontal Lobe", minutes: 20, image: "imgs/Motor Cortex.png",
    func: "Voluntary movement",
    desc: "A strip of cortex in the precentral gyrus that sends commands to the muscles. It is organized as a map of the body (the motor homunculus).",
    clinical: "Surgeons map it during awake craniotomy to protect movement when removing nearby tumors."
  },
  {
    id: 3, name: "Broca's Area", category: "Frontal Lobe", minutes: 15, image: "imgs/Broca's Area.png",
    func: "Speech production",
    desc: "Found in the inferior frontal gyrus, usually in the left hemisphere. It plans the movements needed to produce speech.",
    clinical: "Damage causes Broca's aphasia: understanding is preserved but speech is slow and effortful."
  },
  {
    id: 4, name: "Somatosensory Cortex", category: "Parietal Lobe", minutes: 20, image: "imgs/Somatosensory Cortex.png",
    func: "Touch & body sensation",
    desc: "The postcentral gyrus receives touch, pressure, pain and position signals from the opposite side of the body.",
    clinical: "A stroke or tumor here causes numbness or loss of position sense on the opposite side."
  },
  {
    id: 5, name: "Wernicke's Area", category: "Temporal Lobe", minutes: 15, image: "imgs/Wernicke's Area.png",
    func: "Language comprehension",
    desc: "Located in the posterior superior temporal gyrus (usually left). It lets us understand spoken and written language.",
    clinical: "Damage causes fluent but meaningless speech with poor comprehension (Wernicke's aphasia)."
  },
  {
    id: 6, name: "Auditory Cortex", category: "Temporal Lobe", minutes: 15, image: "imgs/Auditory Cortex.png",
    func: "Hearing & sound processing",
    desc: "Sits in the superior temporal gyrus and processes pitch, volume and the location of sounds.",
    clinical: "Damage on both sides can cause cortical deafness even when the ears are healthy."
  },
  {
    id: 7, name: "Visual Cortex", category: "Occipital Lobe", minutes: 20, image: "imgs/Visual Cortex.png",
    func: "Vision processing",
    desc: "Located at the back of the brain in the occipital lobe. It receives signals from the eyes and builds what we see.",
    clinical: "Damage causes visual field defects such as homonymous hemianopia."
  },
  {
    id: 8, name: "Hippocampus", category: "Limbic System", minutes: 30, image: "imgs/Hippocampus.png",
    func: "Memory formation",
    desc: "A seahorse-shaped structure deep in the temporal lobe that turns short-term experiences into long-term memories and supports navigation.",
    clinical: "It is one of the first areas hit by Alzheimer's disease. Removal in patient H.M. caused permanent inability to form new memories."
  },
  {
    id: 9, name: "Amygdala", category: "Limbic System", minutes: 25, image: "imgs/Amygdala.png",
    func: "Emotions & fear",
    desc: "An almond-shaped cluster of nuclei in the temporal lobe that detects threats and gives memories their emotional weight.",
    clinical: "It is overactive in anxiety disorders and PTSD."
  },
  {
    id: 10, name: "Thalamus", category: "Diencephalon", minutes: 20, image: "imgs/Thalamus.png",
    func: "Sensory relay station",
    desc: "Deep in the center of the brain, it relays almost all sensory information to the cortex and helps regulate sleep and alertness.",
    clinical: "A target for deep brain stimulation to treat tremor and some types of epilepsy."
  },
  {
    id: 11, name: "Cerebellum", category: "Hindbrain", minutes: 25, image: "imgs/Cerebellum.png",
    func: "Balance & coordination",
    desc: "The 'little brain' at the back and bottom. It fine-tunes movement, posture and balance, and contains more than half of the brain's neurons.",
    clinical: "Damage causes ataxia and intention tremor. Medulloblastoma, a common childhood brain tumor, arises here."
  },
  {
    id: 12, name: "Brainstem", category: "Hindbrain", minutes: 30, image: "imgs/Brainstem.png",
    func: "Breathing, heartbeat & consciousness",
    desc: "Connects the brain to the spinal cord. It contains the midbrain, pons and medulla, which control vital automatic functions.",
    clinical: "Lesions are often life-threatening, and this region is among the hardest to operate on."
  }
];

// ===== Storage helpers =====
function load(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; }
  catch (e) { return fallback; }
}
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

const getUsers = () => load("users", []);
const getUser = () => load("currentUser", null);
const userKey = (name) => name + "_" + getUser().email;
const getCart = () => (getUser() ? load(userKey("cart"), []) : []);
const getFavs = () => (getUser() ? load(userKey("favs"), []) : []);
const saveCart = (c) => save(userKey("cart"), c);
const saveFavs = (f) => save(userKey("favs"), f);
const cartCount = () => getCart().reduce((n, i) => n + i.qty, 0);
const findProduct = (id) => products.find(p => p.id === id);

// ===== Study list / favourites actions =====
function requireLogin() {
  if (!getUser()) { window.location.href = "login.html"; return false; }
  return true;
}
function addToCart(id) {
  if (!requireLogin()) return;
  const cart = getCart();
  if (!cart.find(i => i.id === id)) cart.push({ id, qty: 1 });
  saveCart(cart);
}
function removeFromCart(id) { saveCart(getCart().filter(i => i.id !== id)); }
function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  saveCart(cart.filter(i => i.qty > 0));
}
function toggleFav(id) {
  if (!requireLogin()) return;
  let favs = getFavs();
  favs = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
  saveFavs(favs);
}

// ===== Details modal =====
function showDetails(id) {
  const p = findProduct(id);
  document.getElementById("modal-box").innerHTML =
    `<img src="${p.image}" alt="${p.name}">
         <div class="p-3">
            <h5>${p.name}</h5>
            <p class="mb-1"><strong>Category:</strong> ${p.category}</p>
            <p class="mb-1"><strong>Function:</strong> ${p.func}</p>
            <p class="mb-1"><strong>About:</strong> ${p.desc}</p>
            <p class="mb-3"><strong>Clinical note:</strong> ${p.clinical}</p>
            <button class="btn btn-dark btn-sm" onclick="closeModal()">Close</button>
         </div>`;
  document.getElementById("modal-bg").style.display = "flex";
}
function closeModal(e) {
  if (e && e.target.id !== "modal-bg") return;
  document.getElementById("modal-bg").style.display = "none";
}

// ===== Navbar =====
function renderNav() {
  const box = document.getElementById("nav-actions");
  if (!box) return;
  const user = getUser();
  if (!user) {
    box.innerHTML =
      '<a href="login.html" class="btn btn-outline-info btn-sm mr-2">Login</a>' +
      '<a href="register.html" class="btn btn-outline-success btn-sm">Register</a>';
    return;
  }
  const items = getCart().map(i => {
    const p = findProduct(i.id);
    return `<div class="cart-dd-item">
            <strong>${p.name}</strong><span>${p.minutes * i.qty} min</span>
            <div class="qty-row">
                <button class="qty-btn" onclick="ddQty(${p.id}, -1)">-</button>
                <span class="mx-1">${i.qty}</span>
                <button class="qty-btn" onclick="ddQty(${p.id}, 1)">+</button>
            </div></div>`;
  }).join("");
  box.innerHTML =
    `<span class="mr-3 small">Hello, ${user.firstName}</span>
         <div class="cart-wrapper">
            <a href="study.html" class="cart-icon"><i class="fa fa-book"></i> ${cartCount()}</a>
            <div class="cart-dropdown">${items}<a href="study.html" class="view-all">View Study List</a></div>
         </div>
         <button class="btn btn-outline-danger btn-sm ml-2" onclick="logout()">Logout</button>`;
}
function ddQty(id, d) { changeQty(id, d); refreshPage(); }
function logout() { localStorage.removeItem("currentUser"); window.location.href = "index.html"; }
function refreshPage() {
  renderNav();
  if (typeof renderPage === "function") renderPage();
}

// ===== Shared site header / footer =====
function renderHeader() {
  const box = document.getElementById("site-header");
  if (!box) return;
  box.innerHTML = `
    <a class="brand" href="index.html"><img src="imgs/logo-header.jpg" alt="Brain ATL. Neuroanatomy"></a>
    <button class="nav-toggle" type="button" aria-label="Menu" onclick="document.getElementById('site-nav').classList.toggle('open')"><i class="fa fa-bars"></i></button>
    <nav class="site-nav" id="site-nav">
      <a href="index.html" data-page="index">Home</a>
      <a href="anatomy.html" data-page="anatomy">Anatomy</a>
      <div class="nav-dd">
        <a href="index.html#resources">Resources <i class="fa fa-angle-down ml-1"></i></a>
        <div class="nav-dd-menu">
          <a href="anatomy.html?type=category&q=Lobe">Brain Lobes &amp; Functions</a>
          <a href="anatomy.html">Brain Sections</a>
          <a href="anatomy.html?type=category&q=Limbic">Neural Pathways</a>
        </div>
      </div>
      <a href="quiz.html" data-page="quiz">Quizzes</a>
      <a href="index.html#about">About</a>
      <a href="#contact">Contact</a>
    </nav>
    <div class="header-tools">
      <a class="search-btn" href="anatomy.html#search" aria-label="Search"><i class="fa fa-search"></i></a>
      <div id="nav-actions" class="d-flex align-items-center"></div>
    </div>`;
  const page = (location.pathname.split("/").pop() || "index.html").replace(".html", "") || "index";
  box.querySelectorAll("[data-page]").forEach(a => a.classList.toggle("active", a.dataset.page === page));
}

function renderFooter() {
  const box = document.getElementById("site-footer");
  if (!box) return;
  box.innerHTML = `
    <section class="newsletter" id="contact">
      <div class="nl-box">
        <div class="nl-ico"><i class="fa fa-envelope-o"></i></div>
        <div class="nl-text"><h3>Stay Updated</h3><p>Get the latest resources and updates on neuroanatomy.</p></div>
        <form class="nl-form" id="nl-form">
          <input type="email" id="nl-email" placeholder="Your email address" required>
          <button type="submit" class="pill pill-gold">Subscribe</button>
        </form>
      </div>
    </section>
    <footer class="site-footer">
      <div class="ft-top">
        <a class="ft-brand" href="index.html"><img src="imgs/logo-light.png" alt="Brain ATL. Neuroanatomy"></a>
        <nav class="ft-links">
          <a href="index.html">Home</a><a href="anatomy.html">Anatomy</a><a href="index.html#resources">Resources</a>
          <a href="quiz.html">Quizzes</a><a href="index.html#about">About</a><a href="#contact">Contact</a>
        </nav>
        <div class="ft-social">
          <a href="https://www.youtube.com" target="_blank" rel="noopener" aria-label="YouTube"><i class="fa fa-youtube-play"></i></a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa fa-linkedin"></i></a>
          <a href="https://x.com" target="_blank" rel="noopener" aria-label="X"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
        </div>
      </div>
      <div class="ft-bottom">
        <span>&copy; ${new Date().getFullYear()} Brain ATL. All rights reserved.</span>
        <em>Understand the Brain. Expand Your Knowledge.</em>
      </div>
    </footer>`;
  document.getElementById("nl-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("nl-email").value.trim().toLowerCase();
    const list = load("subscribers", []);
    if (!list.includes(email)) { list.push(email); save("subscribers", list); }
    e.target.innerHTML = '<span class="nl-thanks"><i class="fa fa-check"></i> Thank you for subscribing!</span>';
  });
}

document.addEventListener("DOMContentLoaded", () => { renderHeader(); renderFooter(); renderNav(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
