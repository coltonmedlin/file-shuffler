import { readdir } from 'node:fs/promises';
import allFilesInFolderHaveBeenShuffled from './checkFolder';

jest.mock('node:fs/promises', () => ({
  readdir: jest.fn(),
}));

describe('all files have been shuffled', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('resolves to true for directory with files that all begin with "###-"', async () => {
    const mockValidFiles = [
      '001-testTest.mp4',
      '002-test-test-test+test.png',
      '003-003-test-test-003.jpeg',
      '004-test-004',
    ];
    (readdir as jest.Mock).mockResolvedValueOnce(mockValidFiles);
    await expect(allFilesInFolderHaveBeenShuffled('/testDir')).resolves.toBeTruthy();
  });

  it('resolves to false for files with a directory that do not all begin with "###-"', async () => {
    const mockInvalidFiles = [
      '001-testTest.mp4',
      '02-001-001-test.123',
      'test-test+test.mp3',
      '002-test-test+test-003.ppt',
    ];
    (readdir as jest.Mock).mockResolvedValueOnce(mockInvalidFiles);
    await expect(allFilesInFolderHaveBeenShuffled('/testDir')).resolves.toBeFalsy();
  });

  it('Throws and logs an error if it is unable to read a directory', async () => {
    (readdir as jest.Mock).mockRejectedValueOnce('');
    await expect(allFilesInFolderHaveBeenShuffled('/badDir')).rejects;
    expect(console.error).toBeCalled();
  });

  it('resolves to false for an empty folder', async () => {
    (readdir as jest.Mock).mockResolvedValueOnce([]);
    await expect(allFilesInFolderHaveBeenShuffled('./testDir')).resolves.toBeFalsy();
  });
});
