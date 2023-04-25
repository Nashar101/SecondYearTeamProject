const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebar-close');
const sidebarToggle = document.getElementById('sidebar-toggle');

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

sidebarClose.addEventListener('click', () => {
  sidebar.classList.remove('open');
});
