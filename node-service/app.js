const express = require('express')
const port = process.env.NODE_SERVICE_PORT
const app = express()
const Multer = require('multer');

//route to home index
app.get('/', (req, res) => res.sendFile(__dirname+"/index.html"))


const {Storage} = require('@google-cloud/storage');

// Instantiate a storage client
const storage = new Storage();

// Multer is required to process file uploads and make them available via
// req.files.
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

// A bucket is a container for objects (files).
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

// Process the file upload and upload to Google Cloud Storage.
app.post('/upload', multer.single('user-file'), (req, res, next) => {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', err => {
    next(err);
  });

  blobStream.on('finish', () => {
    res.status(200).send('Your file has was uploaded successfully');
  });

  blobStream.end(req.file.buffer);
});


//listen for requests through port
app.listen(port, () => console.log(`node service is listening on port ${port}!`))

