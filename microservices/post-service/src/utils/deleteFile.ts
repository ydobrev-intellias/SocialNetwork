import path from 'path';
import fs from 'fs';

export const deleteFile = (filePath: string) => {
  try {
    const fullPath = path.join(__dirname, '../../uploads', filePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`File ${fullPath} deleted successfully`);
    } else {
      console.log(`File ${fullPath} not found`);
    }
  } catch (error) {
    console.error('File delete error:', error);
    throw new Error('Media delete failed');
  }
};
