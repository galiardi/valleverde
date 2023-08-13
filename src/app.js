import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import fileupload from 'express-fileupload';
import apiRouter from './routes/api/index.js';

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // para leer el id enviado en el body junto al archivo de la imagen
app.use(
  fileupload()
  //   {
  //   limits: {
  //     fileSize: 5000000, //5mb
  //   },
  //   abortOnLimit: true,
  // }
);
app.use(express.static('src/public'));
app.use('/api', apiRouter);

export default app;
