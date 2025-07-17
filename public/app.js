let sweets = [];
let categories = [];
let orders = [];

function renderCategories() {
  const catList = document.getElementById('category-list');
  const catSelect = document.getElementById('category');
  const searchCat = document.getElementById('search-category');
  catList.innerHTML = categories.map(c => `<li>${c.name}</li>`).join('');
  // Always show all categories in the dropdown
  catSelect.innerHTML = '<option value="">Select Category</option>' + categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  searchCat.innerHTML = '<option value="">All Categories</option>' + categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

function renderSweets(list = sweets) {
  const sweetList = document.getElementById('sweet-list');
  sweetList.innerHTML = list.map(s => `
    <div class="sweet-item">
      <img src="${s.imageUrl || 'https://placehold.co/80x80'}" alt="${s.name}" class="sweet-img">
      <div class="sweet-info">
        <b>${s.name}</b> (${getCategoryName(s.categoryId)})<br>
        ₹${s.price} | Qty: ${s.quantity} <br>
        <span class="desc">${s.description || ''}</span><br>
        Expiry: ${s.expiryDate ? new Date(s.expiryDate).toLocaleDateString() : 'N/A'}<br>
        <button onclick="purchaseSweet(${s.id})" ${s.quantity === 0 ? 'disabled' : ''}>Buy</button>
        <button onclick="deleteSweet(${s.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

function renderOrders() {
  const orderList = document.getElementById('order-list');
  orderList.innerHTML = orders.length ? orders.map(o => `<li>Order #${o.id} - ₹${o.total} - ${new Date(o.date).toLocaleString()}</li>`).join('') : '<li>No orders yet.</li>';
}

function getCategoryName(id) {
  const cat = categories.find(c => c.id == id);
  return cat ? cat.name : 'Unknown';
}

function addSweet(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const categoryId = parseInt(document.getElementById('category').value);
  if (!categoryId) {
    alert('Please select a category for the sweet.');
    return;
  }
  const price = parseFloat(document.getElementById('price').value);
  const quantity = parseInt(document.getElementById('quantity').value, 10);
  const description = document.getElementById('description').value;
  const imageUrl = document.getElementById('imageUrl').value;
  const expiryDate = document.getElementById('expiryDate').value;
  const id = sweets.length ? sweets[sweets.length-1].id + 1 : 1;
  sweets.push({ id, name, categoryId, price, quantity, description, imageUrl, expiryDate });
  renderSweets();
  e.target.reset();
}

function addCategory(e) {
  e.preventDefault();
  const name = document.getElementById('category-name').value;
  const id = categories.length ? categories[categories.length-1].id + 1 : 1;
  categories.push({ id, name });
  renderCategories();
  e.target.reset();
}

function deleteSweet(id) {
  sweets = sweets.filter(s => s.id !== id);
  renderSweets();
}

function purchaseSweet(id) {
  const sweet = sweets.find(s => s.id === id);
  if (!sweet || sweet.quantity === 0) return alert('Out of stock!');
  sweet.quantity--;
  const orderId = orders.length ? orders[orders.length-1].id + 1 : 1;
  orders.push({ id: orderId, items: [{ sweetId: id, qty: 1, price: sweet.price }], total: sweet.price, date: new Date() });
  renderSweets();
  renderOrders();
}

function filterSortSweets(e) {
  if (e) e.preventDefault();
  let list = [...sweets];
  const name = document.getElementById('search-name').value.toLowerCase();
  const categoryId = parseInt(document.getElementById('search-category').value);
  const minPrice = parseFloat(document.getElementById('min-price').value);
  const maxPrice = parseFloat(document.getElementById('max-price').value);
  const expiryStatus = document.getElementById('expiry-status').value;
  const sortBy = document.getElementById('sort-by').value;
  const sortOrder = document.getElementById('sort-order').value;
  if (name) list = list.filter(s => s.name.toLowerCase().includes(name));
  if (categoryId) list = list.filter(s => s.categoryId === categoryId);
  if (!isNaN(minPrice)) list = list.filter(s => s.price >= minPrice);
  if (!isNaN(maxPrice)) list = list.filter(s => s.price <= maxPrice);
  if (expiryStatus === 'expired') list = list.filter(s => s.expiryDate && new Date(s.expiryDate) < new Date());
  if (expiryStatus === 'valid') list = list.filter(s => !s.expiryDate || new Date(s.expiryDate) >= new Date());
  list.sort((a, b) => {
    let valA = a[sortBy], valB = b[sortBy];
    if (sortBy === 'expiryDate') {
      valA = valA ? new Date(valA).getTime() : 0;
      valB = valB ? new Date(valB).getTime() : 0;
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  renderSweets(list);
}

function showLowStockAlert() {
  const alertDiv = document.getElementById('low-stock-alert');
  const lowStock = sweets.filter(s => s.quantity < 5);
  alertDiv.innerHTML = lowStock.length ? `<span class="alert">Low stock: ${lowStock.map(s => s.name).join(', ')}</span>` : '';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('add-form').addEventListener('submit', addSweet);
  document.getElementById('add-category-form').addEventListener('submit', addCategory);
  document.getElementById('filter-btn').addEventListener('click', filterSortSweets);
  // Demo data
  categories = [ {id:1, name:'Candy'}, {id:2, name:'Pastry'}, {id:3, name:'Chocolate'} ];
  sweets = [
    {id:1, name:'Ladoo', categoryId:1, price:10, quantity:20, description:'Delicious Indian sweet', imageUrl:'', expiryDate:'2025-12-31'},
    {id:2, name:'Barfi', categoryId:2, price:15, quantity:3, description:'Milk-based sweet', imageUrl:'', expiryDate:'2025-11-30'},
    {id:3, name:'Truffle', categoryId:3, price:25, quantity:10, description:'Chocolate truffle', imageUrl:'', expiryDate:'2025-10-15'}
  ];
  renderCategories();
  renderSweets();
  renderOrders();
  setInterval(showLowStockAlert, 2000);
});