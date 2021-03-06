# Rideshare Customer Finder

The purpose of this project is to create an application that will detect individuals attempting to hail a cab or rideshare service by signaling from the side of the road. The intent is eventual integration into a self-driving rideshare service or as a drivers assist feature for current taxi and rideshare services.

## Releases
### 1.0.0-alpha 
This initial release provides users with a rudimentary front end form for submitting images. These images are stored in the cloud and processed using Google Cloud Vision API. The result is a dict of labels that Google's ML model sees in the submitted image along with a percent confidence indicator.

## Upcoming Releases
### 1.1.0-alpha People/Face Recognition
This release will identify potential customers within submitted images, acting as pre-processing step for subsequent recognition models.

### 1.2.0-beta Hand Wave Detection
This release will predict whether or not people identified in the submitted images are waving down a vehicle.

## Services
The application is composed of RESTful services designed to run in containerized environments. Communication between services is handled via HTTP and REST APIs.

### Client Side
Clients are served HTML files and content built with the standard Bootstrap library. Image submission are sent via form elements as POST requests to the web server.

### NodeJS
NodeJS Express is used as the front end server for client side operations, both user image submissions and post processing responses. This service also handles uploading of user submitted images into Cloud Storage (Google Buckets in this case) and calls the python processing service via an axios POST, passing the image's URI.


### Python
The Python service is called via POST when an image has been stored by the NodeJS. After receiving the image URI, this service submits it for processing by the Google Vision API. The response from the Google Vision API is then translated into a dict and sent back to the NodeJS service as a response to it's POST request.

## Running the Application
This app can run locally on two shells but is optimized in containerized environments, Docker for development and Google's App Engine for production.

### Docker...
#### Environmental Variables
#### Building and Running

### App Engine...
#### Environmental Variables...
#### Building and Running

### Local Shell
#### Environmental Variables...
#### Building and Running
