const SweetShop = require('../src/sweetShop');

describe('SweetShop', () => {
  let shop;

  beforeEach(() => {
    shop = new SweetShop();
  });

  test('should add a new sweet', () => {
    shop.addSweet({ name: 'Ladoo', category: 'candy', price: 10, quantity: 20 });
    expect(shop.sweets.length).toBe(1);
    expect(shop.sweets[0].name).toBe('Ladoo');
  });

  test('should delete a sweet by id', () => {
    const sweet = shop.addSweet({ name: 'Barfi', category: 'pastry', price: 15, quantity: 10 });
    shop.deleteSweet(sweet.id);
    expect(shop.sweets.length).toBe(0);
  });

  test('should search sweets by name', () => {
    shop.addSweet({ name: 'Ladoo', category: 'candy', price: 10, quantity: 20 });
    shop.addSweet({ name: 'Barfi', category: 'pastry', price: 15, quantity: 10 });
    const results = shop.searchSweets({ name: 'Ladoo' });
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Ladoo');
  });

  test('should purchase sweets and decrease quantity', () => {
    const sweet = shop.addSweet({ name: 'Ladoo', category: 'candy', price: 10, quantity: 20 });
    shop.purchaseSweet(sweet.id, 5);
    expect(shop.sweets[0].quantity).toBe(15);
  });

  test('should not allow purchase if not enough stock', () => {
    const sweet = shop.addSweet({ name: 'Ladoo', category: 'candy', price: 10, quantity: 2 });
    expect(() => shop.purchaseSweet(sweet.id, 5)).toThrow('Not enough stock');
  });

  test('should restock sweets', () => {
    const sweet = shop.addSweet({ name: 'Ladoo', category: 'candy', price: 10, quantity: 2 });
    shop.restockSweet(sweet.id, 8);
    expect(shop.sweets[0].quantity).toBe(10);
  });

  test('should sort sweets by price', () => {
    shop.addSweet({ name: 'Ladoo', category: 'candy', price: 10, quantity: 20 });
    shop.addSweet({ name: 'Barfi', category: 'pastry', price: 15, quantity: 10 });
    shop.addSweet({ name: 'Jalebi', category: 'candy', price: 8, quantity: 30 });
    const sortedSweets = shop.sortSweets('price');
    expect(sortedSweets[0].name).toBe('Jalebi');
    expect(sortedSweets[1].name).toBe('Ladoo');
    expect(sortedSweets[2].name).toBe('Barfi');
  });
});