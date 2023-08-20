const logout = document.getElementById('logout');

logout.addEventListener('click', () => {
  localStorage.removeItem('access_token');
  window.location.href('/logout');
});
