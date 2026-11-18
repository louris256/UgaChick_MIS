
const USERS = {
  admin:   { password: 'admin123', name: 'JULIUS', role: 'Administrator', avatar: 'A' },
  manager: { password: 'mgr123',   name: 'OLIVER', role: 'Manager', avatar: 'S' },
  officer: { password: 'off123',   name: 'CHRISTINE', role: 'Production Officer', avatar: 'J' }
};

let currentUser = null;


function loadData(key, defaultVal) {
  const raw = localStorage.getItem('ugachick_' + key);
  return raw ? JSON.parse(raw) : defaultVal;
}

function saveData(key, data) {
  localStorage.setItem('ugachick_' + key, JSON.stringify(data));
}


function initData() {
  if (!localStorage.getItem('ugachick_production')) {
    const sampleProd = [
      { id: 'BAT-001', type: 'Broiler Chicken', farm: 'Namanve Farm', qty: 4500, date: '2026-11-05', by: 'James Okello', notes: '' },
      { id: 'BAT-002', type: 'Day-old Chicks', farm: 'Mukono Hatchery', qty: 12000, date: '2026-11-07', by: 'James Okello', notes: 'Healthy batch' },
      { id: 'BAT-003', type: 'Processed Chicken', farm: 'Processing Plant - Kampala', qty: 2800, date: '2026-11-08', by: 'System Admin', notes: '' }
    ];
    saveData('production', sampleProd);
  }
  if (!localStorage.getItem('ugachick_orders')) {
    const sampleOrders = [
      { id: 'ORD-001', customer: 'Fresh Mart Ltd', phone: '+256700111222', product: 'Broiler Chicken', qty: 500, price: 18000, total: 9000000, status: 'Confirmed', date: '2026-11-09' },
      { id: 'ORD-002', customer: 'Kampala Distributors', phone: '+256772333444', product: 'Day-old Chicks', qty: 2000, price: 2500, total: 5000000, status: 'Pending', date: '2026-11-10' }
    ];
    saveData('orders', sampleOrders);
  }
  if (!localStorage.getItem('ugachick_qc')) {
    const sampleQC = [
      { id: 'QC-001', batchId: 'BAT-001', product: 'Broiler Chicken', result: 'Pass', inspector: 'Sarah Nalwoga', date: '2026-11-06', notes: 'All parameters within range' },
      { id: 'QC-002', batchId: 'BAT-002', product: 'Day-old Chicks', result: 'Pass', inspector: 'James Okello', date: '2026-11-07', notes: '' }
    ];
    saveData('qc', sampleQC);
  }
  seedInventory();
}

function seedInventory() {
  const production = loadData('production', []);
  const inventory = production.map(p => ({
    batchId: p.id,
    product: p.type,
    location: p.farm,
    qtyOnHand: p.qty,
    reserved: 0,
    available: p.qty
  }));
  
  const orders = loadData('orders', []);
  orders.filter(o => o.status === 'Confirmed' || o.status === 'Dispatched').forEach(o => {
    const inv = inventory.find(i => i.product === o.product);
    if (inv) {
      inv.reserved += o.qty;
      inv.available = Math.max(0, inv.qtyOnHand - inv.reserved);
    }
  });
  saveData('inventory', inventory);
}

