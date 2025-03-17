export enum FileSuffix {
  AVATAR = 'avatar',
  COVER = 'cover',
}
export const generateFilename = (userId: string, extension: string) => {
  return `${userId}.${extension}`;
};
