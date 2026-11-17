// ==================== INIT ====================
initData();
// Auto-login if session exists
const saved = localStorage.getItem('ugachick_user');
if (saved) {
  currentUser = JSON.parse(saved);
  showApp();
}
