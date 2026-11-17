// ==================== RENDER FUNCTIONS ====================
function renderAll() {
  renderDashboard();
  renderProduction();
  renderInventory();
  renderOrders();
  renderQC();
  renderReports();
  populateBatchSelect();
}

function renderDashboard() {
  const production = loadData('production', []);
  const orders = loadData('orders', []);
  const inventory = loadData('inventory', []);
  const qc = loadData('qc', []);

  const totalProd = production.reduce((s, p) => s + Number(p.qty), 0);
  document.getElementById('stat-production').textContent = totalProd.toLocaleString();
  document.getElementById('stat-orders').textContent = orders.filter(o => o.status !== 'Cancelled').length;
  document.getElementById('stat-inventory').textContent = inventory.length;

  const passes = qc.filter(q => q.result === 'Pass').length;
  const qcRate = qc.length ? Math.round((passes / qc.length) * 100) + '%' : '—';
  document.getElementById('stat-qc').textContent = qcRate;

  // Recent production
  const prodBody = document.getElementById('dash-production-table');
  prodBody.innerHTML = production.slice(-5).reverse().map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.type}</td>
      <td>${p.farm}</td>
      <td>${Number(p.qty).toLocaleString()}</td>
      <td>${p.date}</td>
      <td><span class="badge badge-green">Recorded</span></td>
    </tr>
  `).join('') || '<tr><td colspan="6" class="empty-state">No production records yet</td></tr>';

  // Recent orders
  const ordBody = document.getElementById('dash-orders-table');
  ordBody.innerHTML = orders.slice(-5).reverse().map(o => `
    <tr>
      <td>${o.id}</td>
      <td>${o.customer}</td>
      <td>${Number(o.total).toLocaleString()}</td>
      <td><span class="badge ${statusBadge(o.status)}">${o.status}</span></td>
      <td>${o.date}</td>
    </tr>
  `).join('') || '<tr><td colspan="5" class="empty-state">No orders yet</td></tr>';
}

function statusBadge(status) {
  if (status === 'Confirmed' || status === 'Dispatched') return 'badge-green';
  if (status === 'Pending') return 'badge-orange';
  if (status === 'Cancelled') return 'badge-red';
  return 'badge-blue';
}

function renderProduction() {
  const production = loadData('production', []);
  const tbody = document.getElementById('production-table');
  tbody.innerHTML = production.slice().reverse().map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.type}</td>
      <td>${p.farm}</td>
      <td>${Number(p.qty).toLocaleString()}</td>
      <td>${p.date}</td>
      <td>${p.by}</td>
      <td><button class="btn btn-sm btn-danger" onclick="deleteProduction('${p.id}')">Delete</button></td>
    </tr>
  `).join('') || '<tr><td colspan="7" class="empty-state">No batches recorded yet</td></tr>';
}

function renderInventory() {
  const inventory = loadData('inventory', []);
  const tbody = document.getElementById('inventory-table');
  tbody.innerHTML = inventory.map(i => {
    const status = i.available <= 0 ? '<span class="badge badge-red">Out of Stock</span>' :
                   i.available < i.qtyOnHand * 0.2 ? '<span class="badge badge-orange">Low Stock</span>' :
                   '<span class="badge badge-green">In Stock</span>';
    return `
      <tr>
        <td>${i.batchId}</td>
        <td>${i.product}</td>
        <td>${i.location}</td>
        <td>${Number(i.qtyOnHand).toLocaleString()}</td>
        <td>${Number(i.reserved).toLocaleString()}</td>
        <td>${Number(i.available).toLocaleString()}</td>
        <td>${status}</td>
      </tr>
    `;
  }).join('') || '<tr><td colspan="7" class="empty-state">No inventory data. Record production first.</td></tr>';
}

function renderOrders() {
  const orders = loadData('orders', []);
  const tbody = document.getElementById('orders-table');
  tbody.innerHTML = orders.slice().reverse().map(o => `
    <tr>
      <td>${o.id}</td>
      <td>${o.customer}</td>
      <td>${o.product}</td>
      <td>${Number(o.qty).toLocaleString()}</td>
      <td>${Number(o.total).toLocaleString()}</td>
      <td><span class="badge ${statusBadge(o.status)}">${o.status}</span></td>
      <td>
        ${o.status === 'Pending' ? `<button class="btn btn-sm btn-success" onclick="updateOrderStatus('${o.id}','Confirmed')">Confirm</button>` : ''}
        ${o.status === 'Confirmed' ? `<button class="btn btn-sm btn-primary" onclick="updateOrderStatus('${o.id}','Dispatched')">Dispatch</button>` : ''}
      </td>
    </tr>
  `).join('') || '<tr><td colspan="7" class="empty-state">No orders yet</td></tr>';
}

function renderQC() {
  const qc = loadData('qc', []);
  const tbody = document.getElementById('qc-table');
  tbody.innerHTML = qc.slice().reverse().map(q => `
    <tr>
      <td>${q.id}</td>
      <td>${q.batchId}</td>
      <td>${q.product}</td>
      <td><span class="badge ${q.result === 'Pass' ? 'badge-green' : q.result === 'Fail' ? 'badge-red' : 'badge-orange'}">${q.result}</span></td>
      <td>${q.inspector}</td>
      <td>${q.date}</td>
      <td>${q.notes || '—'}</td>
    </tr>
  `).join('') || '<tr><td colspan="7" class="empty-state">No quality checks recorded</td></tr>';
}

function renderReports() {
  const production = loadData('production', []);
  const orders = loadData('orders', []);
  const qc = loadData('qc', []);

  document.getElementById('rpt-batches').textContent = production.length;
  document.getElementById('rpt-orders').textContent = orders.length;
  const totalValue = orders.reduce((s, o) => s + Number(o.total), 0);
  document.getElementById('rpt-value').textContent = totalValue.toLocaleString();

  const passes = qc.filter(q => q.result === 'Pass').length;
  document.getElementById('rpt-qc').textContent = qc.length ? Math.round((passes / qc.length) * 100) + '%' : '—';

  // By product
  const byProd = {};
  production.forEach(p => {
    if (!byProd[p.type]) byProd[p.type] = { qty: 0, count: 0 };
    byProd[p.type].qty += Number(p.qty);
    byProd[p.type].count++;
  });
  document.getElementById('rpt-by-product').innerHTML = Object.entries(byProd).map(([k, v]) => `
    <tr><td>${k}</td><td>${v.qty.toLocaleString()}</td><td>${v.count}</td></tr>
  `).join('') || '<tr><td colspan="3" class="empty-state">No data</td></tr>';

  // By status
  const byStatus = {};
  orders.forEach(o => {
    if (!byStatus[o.status]) byStatus[o.status] = { count: 0, value: 0 };
    byStatus[o.status].count++;
    byStatus[o.status].value += Number(o.total);
  });
  document.getElementById('rpt-by-status').innerHTML = Object.entries(byStatus).map(([k, v]) => `
    <tr><td>${k}</td><td>${v.count}</td><td>${v.value.toLocaleString()}</td></tr>
  `).join('') || '<tr><td colspan="3" class="empty-state">No data</td></tr>';
}

function populateBatchSelect() {
  const production = loadData('production', []);
  const sel = document.getElementById('qc-batch');
  const current = sel.value;
  sel.innerHTML = '<option value="">Select batch</option>' +
    production.map(p => `<option value="${p.id}" data-product="${p.type}">${p.id} — ${p.type}</option>`).join('');
  sel.value = current;
}

