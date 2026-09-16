const products = [
  {id:1,name:"KB Signature Hoodie",category:"hoodies",price:79.99,badge:"COMING SOON"},
  {id:2,name:"Gold Crown T-Shirt",category:"tshirts",price:39.99,badge:"NEW"},
  {id:3,name:"King Bena Essential Tee",category:"tshirts",price:34.99,badge:""},
  {id:4,name:"Royal Cargo Pants",category:"pants",price:69.99,badge:"COMING SOON"},
  {id:5,name:"KB Oversized Hoodie",category:"hoodies",price:84.99,badge:""},
  {id:6,name:"Bena Signature Cap",category:"accessories",price:29.99,badge:"NEW"},
  {id:7,name:"Royal Track Pants",category:"pants",price:64.99,badge:""},
  {id:8,name:"KB Gold Chain",category:"accessories",price:24.99,badge:"COMING SOON"}
];

let cart = JSON.parse(localStorage.getItem("kingBenaCart") || "[]");
let category = "all";
let query = "";

const productsEl = document.getElementById("products");
const emptyState = document.getElementById("emptyState");

function money(n){ return "$" + n.toFixed(2) + " CAD"; }

function renderProducts(){
  let list = products.filter(p => (category==="all" || p.category===category) &&
    p.name.toLowerCase().includes(query.toLowerCase()));
  const sort = document.getElementById("sortSelect").value;
  if(sort==="price-low") list.sort((a,b)=>a.price-b.price);
  if(sort==="price-high") list.sort((a,b)=>b.price-a.price);
  productsEl.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-img">${p.badge?`<span class="badge">${p.badge}</span>`:""}<span>KB</span></div>
      <div class="product-info">
        <h3>${p.name}</h3><p>${p.category.toUpperCase()}</p>
        <span class="price">${money(p.price)}</span>
        <button class="add" onclick="addToCart(${p.id})">Ajouter</button>
      </div>
    </article>`).join("");
  emptyState.hidden = list.length !== 0;
}

function saveCart(){localStorage.setItem("kingBenaCart",JSON.stringify(cart));}
function addToCart(id){
  const item=cart.find(x=>x.id===id);
  if(item) item.qty++; else cart.push({id,qty:1});
  saveCart(); renderCart(); showToast("Ajouté au panier ✨");
}
function changeQty(id,delta){
  const item=cart.find(x=>x.id===id); if(!item)return;
  item.qty += delta; if(item.qty<=0) cart=cart.filter(x=>x.id!==id);
  saveCart(); renderCart();
}
function removeItem(id){cart=cart.filter(x=>x.id!==id);saveCart();renderCart();}
function renderCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0);
  document.getElementById("cartCount").textContent=count;
  document.getElementById("cartItems").innerHTML=cart.length ? cart.map(x=>{
    const p=products.find(p=>p.id===x.id);
    return `<div class="cart-line"><div class="cart-thumb">KB</div><div><h4>${p.name}</h4><p>${money(p.price)}</p><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><b>${x.qty}</b><button onclick="changeQty(${p.id},1)">+</button></div></div><button class="remove" onclick="removeItem(${p.id})">✕</button></div>`
  }).join("") : '<p style="text-align:center;color:#888;padding:40px 0">Ton panier est vide.</p>';
  const total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
  document.getElementById("cartTotal").textContent=money(total);
}

function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("overlay").classList.add("show");}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("overlay").classList.remove("show");}
function showToast(text){const t=document.getElementById("toast");t.textContent=text;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}

document.getElementById("cartBtn").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("overlay").onclick=closeCart;
document.getElementById("searchBtn").onclick=()=>{document.getElementById("searchPanel").classList.toggle("open");document.getElementById("searchInput").focus()};
document.getElementById("clearSearch").onclick=()=>{document.getElementById("searchInput").value="";query="";document.getElementById("inlineSearch").value="";renderProducts()};
["searchInput","inlineSearch"].forEach(id=>document.getElementById(id).addEventListener("input",e=>{query=e.target.value;document.getElementById("searchInput").value=query;document.getElementById("inlineSearch").value=query;renderProducts()}));
document.getElementById("sortSelect").addEventListener("change",renderProducts);
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");category=b.dataset.category;renderProducts()});

document.getElementById("checkoutBtn").onclick=()=>{
  if(!cart.length){showToast("Ton panier est vide.");return;}
  document.getElementById("checkoutModal").classList.add("show");
  document.getElementById("checkoutModal").setAttribute("aria-hidden","false");
};
document.getElementById("closeModal").onclick=()=>document.getElementById("checkoutModal").classList.remove("show");
document.getElementById("checkoutForm").onsubmit=(e)=>{
  e.preventDefault();
  cart=[];saveCart();renderCart();
  document.getElementById("checkoutModal").classList.remove("show");closeCart();
  showToast("Commande de démonstration créée 👑");
};
document.getElementById("notifyBtn").onclick=()=>showToast("On ajoutera l'inscription aux nouveautés bientôt ✨");

renderProducts();renderCart();
