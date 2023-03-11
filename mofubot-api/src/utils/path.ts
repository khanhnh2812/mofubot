import { PathLike, readdirSync } from 'fs';

/**
 * Return all directories of a path
 * @param {string | PathLike} source
 * @returns {string[] } dirents
 */
export function getDirectories(source: string | PathLike): string[] {
  return readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

/**
 * Return all files of a path
 * @param {string | PathLike} source
 * @returns {string[]} dirents
 */
export function getFiles(source: string | PathLike): string[] {
  return readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name);
}
