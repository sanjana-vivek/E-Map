import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { getSession } from 'next-auth/react';
import { connectToDb } from '@utils/database';
import File from '@models/file';
import User from '@models/user';

// Disable body parsing by Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), '/public/uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(req, res) {
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
      return res.status(500).json({ error: err.message });
    }

    const uploadedFiles = [];
    for (const key in files) {
      if (files.hasOwnProperty(key)) {
        const file = files[key];
        const filePath = path.join('/uploads', file.newFilename);

        // Save file metadata in MongoDB
        const newFile = new File({
          filename: file.originalFilename,
          path: filePath,
          uploadedBy: user._id,
        });

        await newFile.save();

        uploadedFiles.push(filePath);
      }
    }

    return res.status(200).json({ files: uploadedFiles });
  });
}
