// ==================== FORM HANDLERS ====================
document.getElementById('production-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const production = loadData('production', []);
  const nextNum = production.length + 1;
  const batch = {
    id: 'BAT-' + String(nextNum).padStart(3, '0'),
    type: document.getElementById('prod-type').value,
    farm: document.getElementById('prod-farm').value,
    qty: Number(document.getElementById('prod-qty').value),
    date: document.getElementById('prod-date').value,
    by: currentUser.name,
    notes: document.getElementById('prod-notes').value
  };
  production.push(batch);
  saveData('production', production);
  seedInventory();
  showAlert('prod-alert', 'Production batch ' + batch.id + ' recorded successfully!');
  this.reset();
  document.getElementById('prod-date').value = new Date().toISOString().split('T')[0];
  renderAll();
});

document.getElementById('order-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const orders = loadData('orders', []);
  const nextNum = orders.length + 1;
  const qty = Number(document.getElementById('order-qty').value);
  const price = Number(document.getElementById('order-price').value);
  const order = {
    id: 'ORD-' + String(nextNum).padStart(3, '0'),
    customer: document.getElementById('order-customer').value,
    phone: document.getElementById('order-phone').value,
    product: document.getElementById('order-product').value,
    qty: qty,
    price: price,
    total: qty * price,
    status: 'Pending',
    date: document.getElementById('order-date').value
  };
  orders.push(order);
  saveData('orders', orders);
  showAlert('order-alert', 'Order ' + order.id + ' placed successfully!');
  this.reset();
  document.getElementById('order-date').value = new Date().toISOString().split('T')[0];
  renderAll();
});

document.getElementById('qc-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const qc = loadData('qc', []);
  const nextNum = qc.length + 1;
  const batchSel = document.getElementById('qc-batch');
  const selected = batchSel.options[batchSel.selectedIndex];
  const record = {
    id: 'QC-' + String(nextNum).padStart(3, '0'),
    batchId: batchSel.value,
    product: selected.dataset.product || '',
    result: document.getElementById('qc-result').value,
    inspector: currentUser.name,
    date: new Date().toISOString().split('T')[0],
    notes: document.getElementById('qc-notes').value
  };
  qc.push(record);
  saveData('qc', qc);
  showAlert('qc-alert', 'Quality check ' + record.id + ' saved!');
  this.reset();
  renderAll();
});

function deleteProduction(id) {
  if (!confirm('Delete batch ' + id + '?')) return;
  let production = loadData('production', []);
  production = production.filter(p => p.id !== id);
  saveData('production', production);
  seedInventory();
  renderAll();
}

function updateOrderStatus(id, status) {
  const orders = loadData('orders', []);
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    saveData('orders', orders);
    seedInventory();
    renderAll();
  }
}

function showAlert(elId, msg) {
  const el = document.getElementById(elId);
  el.innerHTML = `<div class="alert alert-success">${msg}</div>`;
  setTimeout(() => { el.innerHTML = ''; }, 4000);
}

