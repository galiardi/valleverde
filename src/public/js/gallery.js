const yearSelector = document.getElementById('year-selector');
const imagesContainer = document.getElementById('images-container');

renderOptions();

yearSelector.addEventListener('change', async (e) => {
  if (!e.target.value) return;
  console.log(e.target.value);
  const response = await fetch(`/api/images/${e.target.value}`);
  const { data, error } = await response.json();

  if (error) return console.log(error);

  const images = data.map((image) => {
    return `
      <div class="card">
        <img src=${image.image_url} class="card-img-top">
        <div class="card-body">
          <p class="card-text">${image.description}</p>
        </div>
      </div>
    `;
  });

  imagesContainer.innerHTML = images.join('');
});

/*<div class="image-container">
        <img src="${image.image_url}" class="" />
        <p>${image.description}</p>
      </div> */

async function renderOptions() {
  // solicita todos los eventos a la api
  const response = await fetch('/api/events/all');
  const { data, error } = await response.json();

  // crea las etiquetas option
  let options;

  if (error) {
    options = '<option value="">Error al cargar eventos</option>';
  } else {
    if (data.length === 0) {
      options = '<option value="">No existen eventos</option>';
    } else {
      options = '<option value="">Selecciona un año</option>';
      data.forEach((ev) => {
        const year = ev.date_time.split('-')[0];
        options += `<option value="${ev.id_event}">${year}</option>`;
      });
    }
  }

  // renderiza las etiquetas option
  yearSelector.innerHTML = options;
}
