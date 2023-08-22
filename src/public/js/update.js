const updateForm = document.getElementById('update-form');
const name = document.getElementById('name');
const lastname = document.getElementById('lastname');
const rut = document.getElementById('rut');
const email = document.getElementById('email');
const password = document.getElementById('password');

updateForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('access_token');
  console.log(token);
  try {
    // la constante id_user es asignada en un script al renderizar la pagina (profile.hbs)
    const response = await fetch(`/api/users/${id_user}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
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
    console.log(data);
    window.location.href = '/';
  } catch (error) {
    alert(error);
  }
});
