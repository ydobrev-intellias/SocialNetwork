import path from 'path';
import fs from 'fs';
import { FileSuffix, generateFilename } from './generateFilename';

export const uploadFile = (
  temporaryPath: string,
  fileSuffix: FileSuffix,
  userId: string,
  extension: string,
) => {
  const filename = generateFilename(userId, extension);
  const uploadDir = path.join(__dirname, '../../uploads', `${fileSuffix}s`);
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const targetPath = path.join(uploadDir, filename);
    const filesInDir = fs.readdirSync(uploadDir);

    const existingFile = filesInDir.find((file) => {
      const fileNameWithoutExt = path.parse(file).name;
      return fileNameWithoutExt === userId;
    });

    if (existingFile) {
      const existingFilePath = path.join(uploadDir, existingFile);
      fs.unlinkSync(existingFilePath);
    }

    fs.renameSync(temporaryPath, targetPath);
    return `/${fileSuffix}s/${filename}`;
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error(`${fileSuffix} upload failed`);
  }
};
