// Valida que el recurso al que se esta accediendo pertenece a quien accede
// Debe ir despues de validateToken o validateAdminToken ya que estos setean res.locals
function validateOwnership(req, res, next) {
  // toma el userId de la ruta
  const splitedUrl = req.originalUrl.split('/');
  const reqUserId = splitedUrl.slice(-1);

  // compara el userId de la ruta con el id_usuario de la informacion obtenida del token, guardada en res.locals
  if (reqUserId != res.locals.user.id_user) {
    return res.status(403).send({ error: 'Invalid ownership' });
  }
  next();
}

export { validateOwnership };
