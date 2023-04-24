import { rename, readdir } from 'node:fs/promises';
import * as undo from './undo';

jest.mock('node:fs/promises', () => ({
  readdir: jest.fn().mockResolvedValue([]),
  rename: jest.fn().mockResolvedValue(''),
}));

describe('undo', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('removeFileRenames', () => {
    it('resolves when files are correctly renamed', async () => {
      await expect(undo.removeFileRenames('./testDir', ['001-test.jpg, 002-test.jpg, 003-test.jpg'])).resolves;
    });

    it('throws an error when rename fails', async () => {
      (rename as jest.Mock).mockRejectedValueOnce('');
      await expect(undo.removeFileRenames('./testDir', ['fail.tsx', '002-test.js'])).rejects;
    });
  });

  describe('undo', () => {
    const mockRename = jest.spyOn(undo, 'removeFileRenames').mockResolvedValue();
    it('resolves when files are properly renamed', async () => {
      await expect(undo.undo('./testDir')).resolves;
    });

    it('rejects and logs error when rename fails', async () => {
      mockRename.mockRejectedValueOnce('');
      await expect(undo.undo('./testDir')).rejects;
      expect(console.error).toBeCalled();
    });

    it('rejects and logs an error when readdir fails', async () => {
      (readdir as jest.Mock).mockRejectedValueOnce('');
      await expect(undo.undo('./testDir')).rejects;
      expect(console.error).toBeCalled();
    });
  });
});
