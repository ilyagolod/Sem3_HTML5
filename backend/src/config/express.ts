import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
const upload = multer();
import IndexController from '@server/controller/IndexController';

const createServer = (): express.Application => {
  const app = express();

  app.use(cors({ origin: '*', credentials: true }));
  // app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.disable('x-powered-by');

  app.get('/test', async (_req, res) => {
    const controller = new IndexController();
    const _res: any = await controller.test();
    res.send({
      data: _res,
    });
  });

  app.get('/images', async (_req: any, res: any) => {
    const controller = new IndexController();
    const images: any = await controller.getImages();

    const form = new FormData();
    for (const image of images) {
      form.append(image.name, fs.readFileSync(image.filepath), {
        filename: `${image.name}.jpg`,
        contentType: 'image/jpeg',
        knownLength: fs.statSync(image.filepath).size,
      });
    }

    res.writeHead(200, {
      'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`,
      'Content-Length': form.getLengthSync(),
    });

    res.write(form.getBuffer());
    res.end();
  });

  app.post('/upload', upload.single('file'), async (_req: any, res) => {
    let _status = true;

    try {
      const controller = new IndexController();
      const file = _req?.file?.buffer;
      const fileName: any = await controller.makeid(10);

      const filePath = path.join(__dirname, `../uploads/${fileName}.jpg`);
      const { mkdir } = fs.promises;

      try {
        await mkdir(path.join(__dirname, '../uploads'));
      } catch (e) {}

      fs.writeFile(filePath, file, { flag: 'wx' }, function (err) {
        if (err) throw err;
      });

      console.log('Buffer has been written to file successfully');
    } catch (err) {
      console.error(err);
      _status = false;
    }

    res.send({
      data: {
        status: _status,
      },
    });
  });

  app.get('/search', async (_req, res) => {
    const controller = new IndexController();

    const search: any = _req.query.search || '';
    const location: any = _req.query.location || '';
    let response = [];

    if (search) {
      response = await controller.search(search, location);
    }

    res.send({
      data: response,
    });
  });

  return app;
};

export { createServer };
