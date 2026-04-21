export interface Supplier {
  id: string;
  name: string;
  contact: string;
}

export interface Part {
  id: string;
  name: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  partsRequired: Record<string, number>; // partId -> quantity
  stock: number;
  price: number;
}

export interface Quotation {
  id: string;
  supplierId: string;
  partId: string;
  price: number;
  leadTimeDays: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Dealer {
  id: string;
  name: string;
}

export interface DealerRequest {
  id: string;
  dealerId: string;
  productId: string;
  quantity: number;
  date: string;
  status: 'pending' | 'fulfilled';
}

export interface Transaction {
  id: string;
  type: 'buy_parts' | 'sell_products';
  amount: number;
  date: string;
  description: string;
}

// Initial Data
const initialSuppliers: Supplier[] = [
  { id: 's1', name: 'Global Metals Inc.', contact: 'contact@globalmetals.com' },
  { id: 's2', name: 'TechChips Electronics', contact: 'sales@techchips.com' },
];

const initialParts: Part[] = [
  { id: 'p1', name: 'Steel Sheets', stock: 50 },
  { id: 'p2', name: 'Microcontrollers', stock: 120 },
  { id: 'p3', name: 'Plastic Casings', stock: 200 },
];

const initialProducts: Product[] = [
  { 
    id: 'prod1', 
    name: 'Smart Controller Model X', 
    partsRequired: { 'p1': 1, 'p2': 2, 'p3': 1 }, 
    stock: 15,
    price: 499.99
  },
  { 
    id: 'prod2', 
    name: 'Basic Industrial Sensor', 
    partsRequired: { 'p1': 2, 'p3': 1 }, 
    stock: 45,
    price: 149.99
  },
];

const initialDealers: Dealer[] = [
  { id: 'd1', name: 'Northwest Tech Distributors' },
  { id: 'd2', name: 'EuroParts Trade' },
];

const initialDealerRequests: DealerRequest[] = [
  { id: 'dr1', dealerId: 'd1', productId: 'prod1', quantity: 10, date: new Date().toISOString(), status: 'pending' },
];

const initialTransactions: Transaction[] = [
  { id: 'tx1', type: 'buy_parts', amount: 1500, date: new Date(Date.now() - 86400000).toISOString(), description: 'Bought 50 Steel Sheets' },
  { id: 'tx2', type: 'sell_products', amount: 3000, date: new Date(Date.now() - 172800000).toISOString(), description: 'Sold 20 Basic Industrial Sensors' },
];

// In-Memory DB with localStorage persistence
class MockDatabase {
  suppliers = [...initialSuppliers];
  parts = [...initialParts];
  products = [...initialProducts];
  quotations: Quotation[] = [];
  dealers = [...initialDealers];
  dealerRequests = [...initialDealerRequests];
  transactions = [...initialTransactions];

  constructor() {
    this.loadFromStorage();
  }

  private saveToStorage() {
    const state = {
      suppliers: this.suppliers,
      parts: this.parts,
      products: this.products,
      quotations: this.quotations,
      dealers: this.dealers,
      dealerRequests: this.dealerRequests,
      transactions: this.transactions
    };
    localStorage.setItem('mdms_state', JSON.stringify(state));
  }

  private loadFromStorage() {
    const saved = localStorage.getItem('mdms_state');
    if (saved) {
      const state = JSON.parse(saved);
      this.suppliers = state.suppliers || this.suppliers;
      this.parts = state.parts || this.parts;
      this.products = state.products || this.products;
      this.quotations = state.quotations || this.quotations;
      this.dealers = state.dealers || this.dealers;
      this.dealerRequests = state.dealerRequests || this.dealerRequests;
      this.transactions = state.transactions || this.transactions;
    }
  }

  private wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generic methods
  async getDashboardStats() {
    await this.wait(300);
    return {
      totalRevenue: this.transactions.filter(t => t.type === 'sell_products').reduce((acc, t) => acc + t.amount, 0),
      totalExpenses: this.transactions.filter(t => t.type === 'buy_parts').reduce((acc, t) => acc + t.amount, 0),
      pendingRequests: this.dealerRequests.filter(r => r.status === 'pending').length,
      lowStockParts: this.parts.filter(p => p.stock < 20).length,
    };
  }

  // Parts / Inventory
  async getParts() { await this.wait(200); return [...this.parts]; }
  async getProducts() { await this.wait(200); return [...this.products]; }

  // Manufacturing Logic
  async checkManufacturingFeasibility(productId: string, quantity: number) {
    await this.wait(300);
    const prod = this.products.find(p => p.id === productId);
    if (!prod) throw new Error("Product not found");

    const reasoning: string[] = [];
    let feasible = true;

    for (const [partId, reqQty] of Object.entries(prod.partsRequired)) {
      const part = this.parts.find(p => p.id === partId);
      const totalNeeded = reqQty * quantity;
      if (!part) continue;
      
      if (part.stock < totalNeeded) {
        feasible = false;
        reasoning.push(`Insufficient ${part.name}: Need ${totalNeeded}, Have ${part.stock}.`);
      } else {
        reasoning.push(`Sufficient ${part.name}: Need ${totalNeeded}, Have ${part.stock}.`);
      }
    }

    if (feasible) {
      reasoning.push(`Intelligent Decision: Proceed with manufacturing. All raw materials are sufficient.`);
    } else {
      reasoning.push(`Intelligent Decision: Cannot manufacture. Please request quotations from suppliers for missing raw materials.`);
    }

    return { feasible, reasoning };
  }

  async manufactureProduct(productId: string, quantity: number) {
    const check = await this.checkManufacturingFeasibility(productId, quantity);
    if (!check.feasible) throw new Error("Insufficient parts to manufacture");

    const prod = this.products.find(p => p.id === productId)!;
    
    // Deduct parts
    for (const [partId, reqQty] of Object.entries(prod.partsRequired)) {
      const part = this.parts.find(p => p.id === partId)!;
      part.stock -= (reqQty * quantity);
    }

    // Add product stock
    prod.stock += quantity;
    this.saveToStorage();
    return true;
  }

  // Suppliers & Quotations
  async getSuppliers() { await this.wait(100); return [...this.suppliers]; }
  async getQuotations() { await this.wait(100); return [...this.quotations]; }
  
  async requestQuotation(supplierId: string, partId: string) {
    await this.wait(400);
    const newQuotation: Quotation = {
      id: `q${Date.now()}`,
      supplierId,
      partId,
      price: Math.floor(Math.random() * 50) + 10, // dummy price
      leadTimeDays: Math.floor(Math.random() * 10) + 2,
      status: 'pending'
    };
    this.quotations.push(newQuotation);
    this.saveToStorage();
    return newQuotation;
  }

  async acceptQuotation(quotationId: string) {
    await this.wait(300);
    const q = this.quotations.find(x => x.id === quotationId);
    if (!q) throw new Error("Not found");
    q.status = 'accepted';
    
    // Simulate buying parts
    const part = this.parts.find(p => p.id === q.partId);
    if (part) {
      part.stock += 100; // dummy addition
      this.transactions.push({
        id: `tx${Date.now()}`,
        type: 'buy_parts',
        amount: q.price * 100,
        date: new Date().toISOString(),
        description: `Bought 100 ${part.name} from accepted quotation`
      });
    }
    this.saveToStorage();
  }

  // Dealers
  async getDealers() { await this.wait(100); return [...this.dealers]; }
  async getDealerRequests() { await this.wait(200); return [...this.dealerRequests]; }

  async fulfillDealerRequest(requestId: string) {
    await this.wait(300);
    const req = this.dealerRequests.find(r => r.id === requestId);
    if (!req) throw new Error("Request not found");
    if (req.status === 'fulfilled') throw new Error("Already fulfilled");

    const prod = this.products.find(p => p.id === req.productId);
    if (!prod) throw new Error("Product not found");

    if (prod.stock < req.quantity) {
      throw new Error(`Insufficient stock for product. Have ${prod.stock}, need ${req.quantity}. Manufacture more.`);
    }

    // Fulfill
    prod.stock -= req.quantity;
    req.status = 'fulfilled';

    // Transaction
    this.transactions.push({
      id: `tx${Date.now()}`,
      type: 'sell_products',
      amount: prod.price * req.quantity,
      date: new Date().toISOString(),
      description: `Sold ${req.quantity} ${prod.name} to fulfill request`
    });
    this.saveToStorage();
  }

  // Billing
  async getTransactions() {
    await this.wait(200);
    return [...this.transactions];
  }
}

export const db = new MockDatabase();
