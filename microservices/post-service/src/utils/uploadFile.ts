import path from 'path';
import fs from 'fs';
import { generateFilename } from './generateFilename';

export const uploadFile = (temporaryPath: string, postId: string, extension: string) => {
  const filename = generateFilename(postId, extension);
  const uploadDir = path.join(__dirname, '../../uploads', 'medias');
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const targetPath = path.join(uploadDir, filename);
    const filesInDir = fs.readdirSync(uploadDir);

    const existingFile = filesInDir.find((file) => {
      const fileNameWithoutExt = path.parse(file).name;
      return fileNameWithoutExt === postId;
    });

    if (existingFile) {
      const existingFilePath = path.join(uploadDir, existingFile);
      fs.unlinkSync(existingFilePath);
    }

    fs.renameSync(temporaryPath, targetPath);
    return `/medias/${filename}`;
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Media upload failed');
  }
};
