const express = require('express')
const app = express()
const Multer = require('multer');
const axios = require('axios');
const uniqid = require('uniqid');

const PORT = process.env.PORT || process.env.NODE_SERVICE_PORT //defaults to container port
const GCLOUD_STORAGE_BUCKET = process.env.GCLOUD_STORAGE_BUCKET
const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT
const ENV_DOMAIN = process.env.ENV_DOMAIN || 'appspot.com' //this will set to local for shell .docker for docker or default to prod .appspot.com
//route to home index

const PYTHON_SERVICE_VIRTUAL_HOST = process.env.PYTHON_SERVICE_VIRTUAL_HOST //get the python virtual host name

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
const bucket = storage.bucket(GCLOUD_STORAGE_BUCKET);

// Process the file upload and upload to Google Cloud Storage.
app.post('/upload', multer.single('user-file'), (req, res, next) => {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }

  var filename = uniqid();

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(filename);
  const blobStream = blob.createWriteStream();

  // gs://<bucket_name>/<file_path_inside_bucket>
  const image_uri = 'gs://' + GCLOUD_STORAGE_BUCKET + '/' + filename;

  blobStream.on('error', err => {
    next(err);
  });

  blobStream.on('finish', () => {
    
  //POST file location
	axios.post('http://python-service.'+GOOGLE_CLOUD_PROJECT+'.'+ENV_DOMAIN+'/process-image/api/v1.0/submit', {
	image_uri: image_uri
	}, console.log('called python service'))
	.then(function (response) {
	console.log(response.data);
	res.status(200).send(response.data);
	})
	.catch(function (error) {
	console.log(error);
	});

	
  });

  blobStream.end(req.file.buffer);

});


//listen for requests through port
app.listen(PORT, '0.0.0.0', () => console.log(`node service is listening on port ${PORT}!`))

