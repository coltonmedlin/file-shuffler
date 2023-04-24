import { rename, readdir } from 'node:fs/promises';

export const removeFileRenames = async (filePath: string, files: string[]): Promise<void> => {
  const promises: Promise<void>[] = [];
  try {
    files.forEach((file) => {
      const newFileName = file.replace(/^[0-9]{3}[-]/g, '');
      const oldPath = `${filePath}/${file}`;
      const newPath = `${filePath}/${newFileName}`;
      promises.push(rename(oldPath, newPath));
    });
    await Promise.all(promises);
  } catch (err) {
    return err;
  }
};

export const undo = async (filePath: string): Promise<void> => {
  try {
    const rawFiles = await readdir(filePath);
    const files = rawFiles.filter((file) => file[0] !== '.');
    await removeFileRenames(filePath, files);
  } catch (err) {
    console.error(err);
  }
};
