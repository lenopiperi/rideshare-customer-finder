const express = require('express')
const port = process.env.PORT || process.env.NODE_SERVICE_PORT //defaults to container port
const app = express()
const Multer = require('multer');
const axios = require('axios');
const uniqid = require('uniqid');

const GCLOUD_STORAGE_BUCKET = 'rideshare-customer-finder.appspot.com'//process.env.GCLOUD_STORAGE_BUCKET
// const PYTHON_SERVICE_PORT = process.env.PYTHON_SERVICE_PORT

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
  https://[SERVICE_ID]-dot-[MY_PROJECT_ID].appspot.com
	axios.post('http://python-service-dot-rideshare-customer-finder.appspot.com/process-image/api/v1.0/submit', {
	image_uri: image_uri, //can I remove this comma?
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
app.listen(port, () => console.log(`node service is listening on port ${port}!`))

