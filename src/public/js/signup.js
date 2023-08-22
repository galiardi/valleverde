const signupForm = document.getElementById('signup-form');
const name = document.getElementById('name');
const lastname = document.getElementById('lastname');
const rut = document.getElementById('rut');
const email = document.getElementById('email');
const password = document.getElementById('password');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value.trim(),
        lastname: lastname.value.trim(),
        rut: rut.value.trim(),
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
