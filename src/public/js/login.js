const loginForm = document.getElementById('login-form');
const email = document.getElementById('email');
const password = document.getElementById('password');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value.trim(),
        password: password.value.trim(),
      }),
    });
    const { data, error } = await response.json();

    if (error) {
      alert(error);
      return;
    }

    // Guardo el token en el localStorage para poder enviarlo en Headers/Authorization al llamar a la api
    // Posteriormente empece a guardar el token tambien en las cookies, para saber si el usuario esta logeado antes de renderizar las vistas.
    // PENDIENTE: Decidir si trabajo solo con el token en las cookies (Investigar seguridad)

    localStorage.setItem('access_token', data.token);
    window.location.href = '/';
  } catch (error) {
    alert(error);
  }
});
