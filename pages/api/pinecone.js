Certainly! Here's the code for the API route with error handling, logging, and authentication:

```javascript
// pages/api/pinecone.js

import { NextApiRequest, NextApiResponse } from 'next';
// Assuming Pinecone provides an SDK or API
// You might need to install and import the actual SDK if it exists
// import Pinecone from 'pinecone-sdk';

// Retrieve connection details from .env
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

// Setup Pinecone client/connection using environment variable
// This is a placeholder; adjust based on the actual Pinecone SDK
// const pineconeClient = new Pinecone({ apiKey: PINECONE_API_KEY });

// Logging middleware
function logRequest(req, res, next) {
  console.log(`[Request] ${req.method} ${req.url} - Body:`, req.body);
  const originalSend = res.send;
  res.send = function(body) {
    console.log(`[Response] ${res.statusCode} - Body:`, body);
    originalSend.call(this, body);
  };
  next();
}

// Authentication middleware
function authenticate(req, res, next) {
  const token = req.headers['authorization'];
  if (!token || token !== AUTH_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

export default async (req, res) => {
  // Apply middleware
  logRequest(req, res, () => {});
  authenticate(req, res, () => {});

  try {
    if (req.method === 'POST') {
      const { fileName, sasAccountName, folderName } = req.body;
      // Placeholder for sending file to Pinecone
      // const response = await pineconeClient.sendFile({
      //   fileName,
      //   sasAccountName,
      //   folderName
      // });
      res.status(200).json({ message: 'File sent and indexed.' });
    } else if (req.method === 'DELETE') {
      const { fileName } = req.body;
      // Placeholder for deleting file from Pinecone
      // const response = await pineconeClient.deleteFile({ fileName });
      res.status(200).json({ message: 'File deleted and unindexed.' });
    } else {
      res.status(405).json({ message: 'Method not allowed.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
```

Please note:

- The code includes placeholders for the Pinecone SDK. If Pinecone provides an actual SDK, you'll need to install it and adjust the code accordingly.
- The `logRequest` and `authenticate` functions are middleware functions for logging and authentication, respectively.

You can create a new file named `pinecone.js` inside the `pages/api` directory of your project and paste the above code into it.
