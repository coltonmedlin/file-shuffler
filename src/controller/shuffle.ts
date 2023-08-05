import { readdir, rename } from 'node:fs/promises';

export const createNumberArray = (length: number): string[] => {
  const numberArray: string[] = [];
  for (let i = 1; i < length + 1; i++) {
    numberArray.push(i.toString().padStart(3, '0'));
  }
  return numberArray;
};

export const shuffleArray = (array: string[]): string[] => {
  const shuffledArray = array.slice(0);
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffledArray[i];
    shuffledArray[i] = shuffledArray[j];
    shuffledArray[j] = temp;
  }
  return shuffledArray;
};

export const generateFilePrepends = (totalFiles: number): string[] => {
  const numberArray = createNumberArray(totalFiles);
  return shuffleArray(numberArray);
};

export const renameFiles = async (filePath: string, files: string[], filePrepends: string[]): Promise<void> => {
  const promises: Promise<void>[] = [];
  try {
    files.forEach((file, index) => {
      const oldPath = `${filePath}/${file}`;
      const newPath = `${filePath}/${filePrepends[index]}-${file}`;
      promises.push(rename(oldPath, newPath));
    });
    await Promise.all(promises);
  } catch (err) {
    return err;
  }
};

export const shuffle = async (filePath: string): Promise<void> => {
  try {
    const rawFiles = await readdir(filePath);
    const files = rawFiles.filter((file) => file[0] !== '.');
    const filePrepends = generateFilePrepends(files.length);
    await renameFiles(filePath, files, filePrepends);
  } catch (err) {
    console.error(err);
    return err;
  }
};
