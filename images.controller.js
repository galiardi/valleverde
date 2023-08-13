import path from 'path';
import fs from 'fs/promises';
import Jimp from 'jimp';
import { jewelsModel } from '../models/jewels.model.js';
import { imagesModel } from '../models/imagesModel.js';
import { get__dirname } from '../util/get__.js';

const __dirname = get__dirname(import.meta.url);

async function createImage(req, res) {
  const response = {
    data: null,
    error: null,
  };

  const { file } = req.files;
  const { id_jewel } = req.body;

  const { name, ext } = path.parse(file.name);

  // valida extension
  if (ext !== '.jpg') {
    response.error = 'Extension must be jpg';
    return res.status(400).send(response);
  }

  // valida tamano del archivo
  // if (file.size > 5 * 1024 * 1024) {
  //   response.error = 'File size exceeds limit (5mb)';
  //   return res.status(400).send(response);
  // }

  // valida la existencia de la joya
  const jewel = await jewelsModel.get(id_jewel);
  if (!jewel) {
    response.error = 'Item does not exist';
    return res.status(400).send(response);
  }

  // valida existencia de un directorio con el nombre correspondiente al id proporcionado(id_jewel), si no existe lo crea
  const folder = path.join(__dirname, '..', 'public', 'images', 'jewels', id_jewel);

  try {
    await fs.access(folder);
  } catch (error) {
    try {
      await fs.mkdir(folder);
    } catch (error) {
      console.log(error);
      response.error = 'Internal error';
      return res.status(500).send(response);
    }
  }

  // modifica las imagenes y las guarda
  const grayFilename = name + '_gray' + ext;
  const colorFilename = name + '_color' + ext;

  try {
    const img1 = await Jimp.read(file.data);
    await img1.resize(256, 256).grayscale().writeAsync(path.join(folder, grayFilename));

    const img2 = await Jimp.read(file.data);
    await img2.resize(256, 256).writeAsync(path.join(folder, colorFilename));
  } catch (error) {
    response.error = 'Internal error';
    return res.status(500).send(response);
  }

  const imageUrls = {
    grayscale: `http://${req.headers.host}/images/jewels/${id_jewel}/${grayFilename}`,
    color: `http://${req.headers.host}/images/jewels/${id_jewel}/${colorFilename}`,
  };

  // asigna las imagenes a la joya
  const result = await imagesModel.create({ ...imageUrls, id_jewel });

  if (result === null) {
    response.error = 'Internal error';
    return res.status(500).send(response);
  }

  response.data = {
    imageUrls,
  };
  res.status(201).send(response);
}

async function updateImage(req, res) {
  const response = {
    data: null,
    error: null,
  };

  const { file } = req.files;
  const { id: id_jewel } = req.params;

  const { name, ext } = path.parse(file.name);

  // valida extension
  if (ext !== '.jpg') {
    response.error = 'Extension must be jpg';
    return res.status(400).send(response);
  }

  // valida tamano del archivo
  // if (file.size > 5 * 1024 * 1024) {
  //   response.error = 'File size exceeds limit (5mb)';
  //   return res.status(400).send(response);
  // }

  // valida la existencia de la joya
  const jewel = await jewelsModel.get(id_jewel);
  if (!jewel) {
    response.error = 'Item does not exist';
    return res.status(400).send(response);
  }

  // valida existencia de un directorio con el nombre correspondiente al id proporcionado(id_jewel), si no existe lo crea
  // Este paso puede ser innecesario ya que la carpeta deberia existir
  const folder = path.join(__dirname, '..', 'public', 'images', 'jewels', id_jewel);
  let prevImages;

  try {
    await fs.access(folder);
    // guarda los nombres de las imagenes anteriores para borrarlas al final si todo sale bien
    prevImages = await fs.readdir(folder);
    console.log(prevImages);
  } catch (error) {
    try {
      await fs.mkdir(folder);
    } catch (error) {
      console.log(error);
      response.error = 'Internal error';
      return res.status(500).send(response);
    }
  }

  // modifica las imagenes y las guarda
  const grayFilename = name + '_gray_' + Date.now() + ext;
  const colorFilename = name + '_color_' + Date.now() + ext;

  try {
    const img1 = await Jimp.read(file.data);
    await img1.resize(256, 256).grayscale().writeAsync(path.join(folder, grayFilename));

    const img2 = await Jimp.read(file.data);
    await img2.resize(256, 256).writeAsync(path.join(folder, colorFilename));
  } catch (error) {
    response.error = 'Internal error';
    return res.status(500).send(response);
  }

  const imageUrls = {
    grayscale: `http://${req.headers.host}/images/jewels/${id_jewel}/${grayFilename}`,
    color: `http://${req.headers.host}/images/jewels/${id_jewel}/${colorFilename}`,
  };

  // borra las imagenes asignadas anteriormente a la joya en la base de datos
  const result1 = await imagesModel.delete(id_jewel);
  if (result1 === null) {
    response.error = 'Internal error';
    return res.status(500).send(response);
  }

  // asigna las imagenes a la joya en la base de datos
  const result2 = await imagesModel.create({ ...imageUrls, id_jewel });

  if (result2 === null) {
    response.error = 'Internal error';
    return res.status(500).send(response);
  }

  // borra las imagenes anteriores
  const promisesArr = prevImages.map((image) => {
    fs.unlink(path.join(folder, image));
  });
  await Promise.all(promisesArr);

  response.data = {
    imageUrls,
  };
  res.status(201).send(response);
}

export { createImage, updateImage };
