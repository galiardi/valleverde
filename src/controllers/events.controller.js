import { Event } from '../models/event.model.js';
import { User } from '../models/user.model.js';
import { RecordEvent } from '../models/recordEvent.model.js';
import { sendEmail } from '../functions/sendEmail.js';

async function registerUserOnEvent(req, res) {
  const response = {
    message: 'Register user on event',
    data: null,
    error: null,
  };

  // valida la existencia de los parametros requeridos
  const { id_event, id_user, trees } = req.body;
  if (!id_event || !id_user || !trees) {
    response.error = 'Missing required parameters';
    return res.status(400).send(response);
  }

  // valida que el usuario que se esta registrando corresponda con el usuario del token
  if (id_user != res.locals.id_user) {
    response.error = 'Invalid ownership';
    return res.status(403).send(response);
  }

  const recordEvent = new RecordEvent(req.body);
  const result = await recordEvent.create();

  if (result === null) {
    response.error = 'Error registering user on event';
    return res.status(500).send(response);
  }

  if (result === 'User or event not found') {
    response.error = result;
    return res.status(404).send(response);
  }

  if (result === 'User already registered on event') {
    response.error = result;
    return res.status(409).send(response);
  }

  // Enviaremos la respuesta existosa(201) incluso si falla el proceso de enviar el mail de confirmacion, debido a esto y con el objetivo de reducir el tiempo de espera de la respuesta, se ha movido hasta el final el intento de enviar el mail.
  response.data = { insertId: result.insertId };
  res.status(201).send(response);

  try {
    const user = await User.getUserById(id_user);
    const event = await Event.getEventById(id_event);

    if (!user || !event) return;

    sendEmail({
      email: user.email,
      subject: 'Confirmacion de registro',
      message: `Usted se ha registrado en el evento ${event.name}.`,
    });
  } catch (error) {
    console.log(error);
  }
}

async function createEvent(req, res) {
  const response = {
    message: 'Create event',
    data: null,
    error: null,
  };

  // valida la existencia de los parametros requeridos
  const { name, description, date_time, location } = req.body;
  if (!name || !description || !date_time || !location) {
    response.error = 'Missing required parameters';
    return res.status(400).send(response);
  }

  const event = new Event(req.body);
  const result = await event.create();

  if (result === null) {
    response.error = 'Error creating event';
    return res.status(500).send(response);
  }

  response.data = { insertId: result.insertId };
  return res.status(201).send(response);
}

async function getAllEvents(req, res) {
  const response = {
    message: 'Get all events',
    data: null,
    error: null,
  };

  const result = await Event.getAll();

  if (result === null) {
    response.error = 'Error getting events';
    return res.status(500).send(response);
  }

  response.data = result;
  return res.status(200).send(response);
}

async function getEventByYear(req, res) {
  const response = {
    message: 'Get event by year',
    data: null,
    error: null,
  };

  const { year } = req.params;

  const result = await Event.getEventByYear(year);

  if (result === null) {
    response.error = 'Error getting event';
    return res.status(500).send(response);
  }

  response.data = result;
  return res.status(200).send(response);
}

export { registerUserOnEvent, createEvent, getAllEvents, getEventByYear };
