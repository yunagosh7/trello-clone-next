import {ID, storage} from '@/appwrite'

const uploadImage = async (file: File) => {
  if(!file) return;

  const fileUploaded = await storage.createFile(
    "64e22e0b1fbe82fcd97a",
      ID.unique(),
      file
  )
  
  return fileUploaded
}

export default uploadImage;