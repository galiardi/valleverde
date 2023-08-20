import { donationsModel } from '../models/donations.model.js';
import { usersModel } from '../models/users.model.js';
import { sendEmail } from '../functions/sendEmail.js';

async function createDonation(req, res) {
  const response = {
    message: 'Create donation',
    data: null,
    error: null,
  };

  const { id_usuario, monto } = req.body; // fecha_donacion DEFAULT CURRENT_TIMESTAMP

  if (!id_usuario || !monto) {
    response.error = 'Missing required parameters';
    return res.status(400).send(response);
  }

  const result = await donationsModel.create(req.body);

  // por confirmar
  if (result === null) {
    response.error = 'Error creating donation';
    return res.status(500).send(response);
  }

  // En caso que se proporcione un id_usuario invalido (ver donations.model.js)
  if (result === 'User not found') {
    response.error = result;
    return res.status(404).send(response);
  }

  // Enviaremos la respuesta existosa(201) incluso si falla el proceso de enviar el mail de confirmacion, debido a esto y con el objetivo de reducir el tiempo de espera de la respuesta, se ha movido hasta el final el intento de enviar el mail.
  response.data = { insertId: result.insertId };
  res.status(201).send(response);

  try {
    const user = await usersModel.getUserById(id_usuario);

    if (!user) return;

    sendEmail({
      email: user.correo,
      subject: 'Confirmacion de donacion',
      message: `Usted ha donado ${monto} pesos. Numero de registro: ${result.insertId}.`,
    });
  } catch (error) {
    console.log(error);
  }
}

async function getDonationsByUserId(req, res) {
  const response = {
    message: 'Get donations by user id',
    data: null,
    error: null,
  };

  const { userId } = req.params;

  const result = await donationsModel.getDonationsByUserId(userId);

  if (result === null) {
    response.error = 'Error getting donations';
    return res.status(500).send(response);
  }

  if (result.length === 0) {
    response.error = 'Not found';
    return res.status(404).send(response);
  }

  response.data = result;
  return res.status(200).send(response);
}

export { createDonation, getDonationsByUserId };
