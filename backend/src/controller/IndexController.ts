import axios from 'axios';
import fs from 'fs';
import path from 'path';
import * as _Promise from 'bluebird';
import { promisify } from 'util';

const readdir_promise = promisify(fs.readdir);
const stat_promise = promisify(fs.stat);

class IndexController {
  private reqUrl =
    'https://search-maps.yandex.ru/v1/?text=парикмахерская&type=biz&ll=37.6471552,55.8891008&spn=0.552069,0.400552&lang=ru_RU&results=5&apikey=a0ea68cd-6b17-4750-b5fd-df46c88c0000';

  public test = async () => {
    try {
      const response = await axios.get(this.reqUrl);
      return response.data.features;
    } catch (error) {
      return [];
    }
  };

  public readFilesAsync = (dir) => {
    return readdir_promise(dir, { encoding: 'utf8' })
      .then((filenames) => {
        const files = this.getFiles(dir, filenames);

        return Promise.all(files);
      })
      .catch((err) => console.error(err));
  };

  public getImage = (imgPath) => {
    const _fs = _Promise.promisifyAll(fs);
    return _fs.readFileAsync(imgPath);
  };

  public getFiles = (dir, filenames) => {
    return filenames.map(async (filename) => {
      const name = path.parse(filename).name;
      const ext = path.parse(filename).ext;
      const filepath = path.resolve(dir, filename);

      const image = await this.getImage(filepath);

      return { name, filepath: filepath };
    });
  };

  public stat = ({ name, ext, filepath }) => {
    return stat_promise(filepath)
      .then((stat) => {
        const isFile = stat.isFile();

        if (isFile) return { name, ext, filepath, stat };
      })
      .catch((err) => console.error(err));
  };

  public makeid = (length: any) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };

  public getImages = async () => {
    try {
      return await this.readFilesAsync(path.join(__dirname, '../uploads'));
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  public search = async (search: any, location: any) => {
    try {
      const response = await axios.get(
        `https://search-maps.yandex.ru/v1/?text=${search}&type=biz&ll=${location}&spn=0.552069,0.400552&lang=ru_RU&results=5&apikey=a0ea68cd-6b17-4750-b5fd-df46c88c0000`,
      );
      return response.data.features;
    } catch (error) {
      console.log(error);
      return [];
    }
  };
}

export default IndexController;
