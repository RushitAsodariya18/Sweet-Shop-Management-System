class SweetShop {
    constructor() {
      this.sweets = [];
      this.categories = [];
      this.orders = [];
      this.users = [];
      this.nextSweetId = 1;
      this.nextCategoryId = 1;
      this.nextOrderId = 1;
      this.nextUserId = 1;
    }
  
    // Category Management
    addCategory(name) {
      const category = { id: this.nextCategoryId++, name };
      this.categories.push(category);
      return category;
    }
  
    // User Management
    addUser(username, role = 'customer') {
      const user = { id: this.nextUserId++, username, role };
      this.users.push(user);
      return user;
    }
  
    // Sweet Management
    addSweet({ name, categoryId, price, quantity, description, imageUrl, expiryDate }) {
      const sweet = {
        id: this.nextSweetId++,
        name,
        categoryId,
        price,
        quantity,
        description,
        imageUrl,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.sweets.push(sweet);
      return sweet;
    }
  
    updateSweet(id, updates) {
      const sweet = this.sweets.find(s => s.id === id);
      if (!sweet) throw new Error('Sweet not found');
      Object.assign(sweet, updates, { updatedAt: new Date() });
      return sweet;
    }
  
    deleteSweet(id) {
      this.sweets = this.sweets.filter(s => s.id !== id);
    }
  
    // Inventory
    restockSweet(id, qty) {
      const sweet = this.sweets.find(s => s.id === id);
      if (!sweet) throw new Error('Sweet not found');
      sweet.quantity += qty;
      sweet.updatedAt = new Date();
    }
  
    // Purchase/Order
    purchaseSweet(userId, sweetId, qty) {
      const user = this.users.find(u => u.id === userId);
      if (!user) throw new Error('User not found');
      const sweet = this.sweets.find(s => s.id === sweetId);
      if (!sweet) throw new Error('Sweet not found');
      if (sweet.quantity < qty) throw new Error('Not enough stock');
      sweet.quantity -= qty;
      sweet.updatedAt = new Date();
      const order = {
        id: this.nextOrderId++,
        userId,
        items: [{ sweetId, qty, price: sweet.price }],
        total: sweet.price * qty,
        date: new Date(),
      };
      this.orders.push(order);
      return order;
    }
  
    // Search, Sort, Filter
    searchSweets({ name, categoryId, minPrice, maxPrice, expiryStatus }) {
      return this.sweets.filter(s => {
        let match = true;
        if (name) match = match && s.name.toLowerCase().includes(name.toLowerCase());
        if (categoryId) match = match && s.categoryId === categoryId;
        if (minPrice) match = match && s.price >= minPrice;
        if (maxPrice) match = match && s.price <= maxPrice;
        if (expiryStatus === 'expired') match = match && s.expiryDate && s.expiryDate < new Date();
        if (expiryStatus === 'valid') match = match && (!s.expiryDate || s.expiryDate >= new Date());
        return match;
      });
    }
  
    sortSweets(by = 'name', order = 'asc') {
      return [...this.sweets].sort((a, b) => {
        let valA = a[by], valB = b[by];
        if (valA instanceof Date) valA = valA.getTime();
        if (valB instanceof Date) valB = valB.getTime();
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }
  
    // Inventory Alerts
    getLowStockSweets(threshold = 5) {
      return this.sweets.filter(s => s.quantity < threshold);
    }
  
    // Order History
    getUserOrders(userId) {
      return this.orders.filter(o => o.userId === userId);
    }
  }
  
  module.exports = SweetShop;