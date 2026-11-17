// ==================== AUTH ====================
function fillLogin(u, p) {
  document.getElementById('username').value = u;
  document.getElementById('password').value = p;
}

document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const u = document.getElementById('username').value.trim().toLowerCase();
  const p = document.getElementById('password').value;
  if (USERS[u] && USERS[u].password === p) {
    currentUser = { username: u, ...USERS[u] };
    localStorage.setItem('ugachick_user', JSON.stringify(currentUser));
    showApp();
  } else {
    alert('Invalid username or password');
  }
});

function logout() {
  localStorage.removeItem('ugachick_user');
  currentUser = null;
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('login-form').reset();
}

function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('user-name').textContent = currentUser.name;
  document.getElementById('user-role').textContent = currentUser.role;
  document.getElementById('user-avatar').textContent = currentUser.avatar;
  document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-UG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  // Set default dates
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('prod-date').value = today;
  document.getElementById('order-date').value = today;
  renderAll();
}

