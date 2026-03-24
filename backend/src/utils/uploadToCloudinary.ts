import cloudinary from '../config/cloudinary.js';

export const uploadImageBuffer = async (buffer: Buffer, folder: string): Promise<string> => {
  const base64 = buffer.toString('base64');
  const dataUri = `data:image/jpeg;base64,${base64}`;

  const uploaded = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: 'image'
  });

  return uploaded.secure_url;
};
