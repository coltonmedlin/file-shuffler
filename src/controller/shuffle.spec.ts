import { rename, readdir } from 'node:fs/promises';
import * as shuffle from './shuffle';

jest.mock('node:fs/promises', () => ({
  rename: jest.fn().mockResolvedValue(''),
  readdir: jest.fn().mockResolvedValue([]),
}));

describe('shuffle', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('create number array', () => {
    it('creates an array with the expected length', () => {
      expect(shuffle.createNumberArray(7).length).toBe(7);
    });
    it('creates an array of strings with the correct number of prepended zeros', () => {
      const result = shuffle.createNumberArray(150);
      expect(result.every((item) => typeof item === 'string')).toBeTruthy();
      expect(result[0]).toBe('001');
      expect(result[20]).toBe('021');
      expect(result[120]).toBe('121');
    });
  });

  describe('shuffle array', () => {
    const inputArray = ['001', '002', '003', '004', '005', '006'];
    it('does not modify input array', () => {
      const result = shuffle.shuffleArray(inputArray);
      expect(result).not.toBe(inputArray);
    });

    it('returns array in a new order', () => {
      const result = shuffle.shuffleArray(inputArray);
      expect(result).not.toEqual(inputArray);
    });

    it('returns an array in a different order each time', () => {
      const result1 = shuffle.shuffleArray(inputArray);
      const result2 = shuffle.shuffleArray(inputArray);
      expect(result1).not.toEqual(result2);
    });
  });

  describe('generateFilePrepends', () => {
    const numberArray = ['001', '002', '003', '004'];
    const shuffledArray = ['004', '001', '003', '002'];
    let mockCreateNumberArray: jest.SpyInstance<any>;
    let mockShuffleArray: jest.SpyInstance<any>;

    beforeEach(() => {
      mockCreateNumberArray = jest.spyOn(shuffle, 'createNumberArray')
        .mockImplementation(() => numberArray);
      mockShuffleArray = jest.spyOn(shuffle, 'shuffleArray')
        .mockImplementation(() => shuffledArray);
    });

    afterEach(() => {
      mockCreateNumberArray.mockRestore();
      mockShuffleArray.mockRestore();
    });

    it('calls createNumberArray and shuffleArray', () => {
      shuffle.generateFilePrepends(4);
      expect(mockCreateNumberArray).toHaveBeenCalledWith(4);
      expect(mockShuffleArray).toHaveBeenCalledWith(numberArray);
    });

    it('returns the result of shuffle array', () => {
      const result = shuffle.generateFilePrepends(4);
      expect(result).toEqual(shuffledArray);
    });
  });

  describe('rename files', () => {
    it('resolves when files are correctly renamed', async () => {
      await expect(shuffle.renameFiles(
        './testDir',
        ['test.jpg', 'test.jpg', 'test.jpg'],
        ['001', '003', '002'],
      )).resolves;
      expect(rename).toBeCalledTimes(3);
    });

    it('rejects when files fail to rename', async () => {
      (rename as jest.Mock).mockRejectedValueOnce('');
      await expect(shuffle.renameFiles(
        './testDir',
        ['test.jpg', 'test.jpg', 'test.jpg'],
        ['001', '003', '002'],
      )).rejects;
    });
  });

  describe('shuffle', () => {
    let mockGenerateFilePrepends: jest.SpyInstance<any>;
    let mockRenameFiles: jest.SpyInstance<any>;
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockGenerateFilePrepends = jest.spyOn(shuffle, 'generateFilePrepends')
        .mockImplementation(() => ['002', '001', '003']);
      mockRenameFiles = jest.spyOn(shuffle, 'renameFiles')
        .mockResolvedValue();
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('resolves when files are properly renamed', async () => {
      await expect(shuffle.shuffle('./testDir')).resolves;
    });

    it('properly filters hidden (dot prepended) files', async () => {
      (readdir as jest.Mock).mockResolvedValueOnce(['.logs', 'test.jpg', 'test.png']);
      await shuffle.shuffle('./testDir');
      expect(mockGenerateFilePrepends).toBeCalledWith(2);
      expect(mockRenameFiles).toBeCalledWith('./testDir', ['test.jpg', 'test.png'], ['002', '001', '003']);
    });

    it('rejects and logs an error when readdir fails', async () => {
      (readdir as jest.Mock).mockRejectedValueOnce([]);
      await expect(shuffle.shuffle('./testDir')).rejects;
      expect(console.error).toHaveBeenCalled();
    });

    it('rejects and logs an error when reanameFiles fails', async () => {
      mockRenameFiles.mockRejectedValueOnce('');
      await expect(shuffle.shuffle('./testDir')).rejects;
      expect(console.error).toHaveBeenCalled();
    });
  });
});
