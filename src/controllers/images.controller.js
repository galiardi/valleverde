import path from 'path';
import fs from 'fs/promises';
import { Image } from '../models/image.model.js';
import { Event } from '../models/event.model.js';
import { get__dirname } from '../functions/get__.js';

const __dirname = get__dirname(import.meta.url);

async function createImage(req, res) {
  const response = {
    message: 'Save image',
    data: null,
    error: null,
  };

  const file = req.files?.file;
  const { id_event, description } = req.body;

  if (!id_event || !file) {
    // descripcion opcional
    response.error = 'Missing required parameters';
    return res.status(400).send(response);
  }

  if (file.name.includes(' ')) {
    response.error = 'File name must not include spaces';
    return res.status(400).send(response);
  }

  // valida la existencia del evento
  const event = await Event.getEventById(id_event);
  if (!event) {
    response.error = 'Event does not exist';
    return res.status(400).send(response);
  }

  // valida existencia de un directorio con el nombre correspondiente al id_event proporcionado, si no existe lo crea
  const folder = path.join(
    __dirname,
    '..',
    'public',
    'images',
    'events',
    id_event
  );
  try {
    await fs.access(folder);
  } catch (error) {
    await fs.mkdir(folder);
  }

  // guarda las imagenes
  try {
    await fs.writeFile(path.join(folder, file.name), file.data);
  } catch (error) {
    console.log(error);
    response.error = 'Error saving images';
    return res.status(500).send(response);
  }

  const image_url = `http://${req.headers.host}/images/events/${id_event}/${file.name}`;

  // asigna las imagenes al evento
  const image = new Image({ image_url, description, id_event });
  const result = await image.create();

  if (result === null) {
    response.error = 'Error saving image';
    return res.status(500).send(response);
  }

  response.data = { image_url };
  res.status(201).send(response);
}

async function getImagesByEventId(req, res) {
  const response = {
    message: 'Get images by event id',
    data: null,
    error: null,
  };

  const { eventId } = req.params;

  // valida la existencia del evento (opcional)
  const event = await Event.getEventById(eventId);
  if (!event) {
    response.error = 'Event not found';
    return res.status(404).send(response);
  }

  const result = await Image.getImagesByEventId(eventId);
  if (!result) {
    response.error = 'Error getting images';
    return res.status(500).send(response);
  }

  response.data = result;
  return res.status(200).send(response);
}

export { createImage, getImagesByEventId };
