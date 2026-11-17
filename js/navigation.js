
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const page = this.dataset.page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    document.getElementById('page-title').textContent = this.textContent.replace(/^[^\s]+\s/, '');
    if (window.innerWidth <= 768) {
      document.getElementById('sidebar').classList.remove('open');
    }
    renderAll();
  });
});

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

