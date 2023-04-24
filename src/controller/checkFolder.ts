import { readdir } from 'node:fs/promises';

const allFilesInFolderHaveBeenShuffled = async (filePath: string): Promise<boolean> => {
  try {
    const rawFiles = await readdir(filePath);
    const files = rawFiles.filter((file) => file[0] !== '.');
    return files.length === 0 ? false : files.every((file) => /^[0-9]{3}[-]/g.test(file));
  } catch (err) {
    console.error(err);
    return err;
  }
};

export default allFilesInFolderHaveBeenShuffled;
