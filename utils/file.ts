import fs from 'fs';

export const readFile = (filepath: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, (err, buffer) => {
      if (err) reject(err);
      resolve(buffer)
    })
  })
}