import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { getSession } from 'next-auth/react';
import { connectToDb } from '@utils/database';
import File from '@models/file';
import User from '@models/user';


export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5
 

const uploadDir = path.join(process.cwd(), '.');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req, res) {
  await connectToDb(); // Ensure the database is connected
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await User.findOne({ email: session.user.email });
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = uploadDir;
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(res.status);
      return res.status(500).json({ error: err.message });
    }

    const uploadedFiles = [];
    for (const key in files) {
      if (files.hasOwnProperty(key)) {
        const file = files[key];
        const filePath = path.join('/uploads', file.name); // Changed file.newFilename to file.name
        const fileType = path.extname(file.name).toLowerCase(); // Changed file.originalFilename to file.name

        // Save file metadata in MongoDB
        const newFile = new File({
          filename: file.name, // Changed file.originalFilename to file.name
          path: filePath,
          uploadedBy: user._id,
          fileType,
        });

        await newFile.save();

        uploadedFiles.push({ path: filePath, type: fileType });
      }
    }

    return res.status(200).json({ files: uploadedFiles });
  });
}
