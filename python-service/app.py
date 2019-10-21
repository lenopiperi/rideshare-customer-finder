from flask import Flask, jsonify
from flask import abort
from flask import make_response
from flask import request
from google.cloud import vision

import os

#move this to a setup file
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

port = os.getenv("PYTHON_SERVICE_PORT")

@app.route('/admin')
def open_admin_console():
    return "admin console"

@app.route('/process-image/api/v1.0/submit', methods=['POST'])
def analyze_image():
    if not request.json or not 'image_uri' in request.json:
        abort(400)
    
    # get image_uri
    image_uri = (request.json).get('image_uri')

    #call vision api
    client = vision.ImageAnnotatorClient()
    image = vision.types.Image()
    image.source.image_uri = image_uri

    response = client.label_detection(image=image)
    
    #build and respond with dict
    response_dict = {}

    for label in response.label_annotations:
        # response_dict[label.description] = label.score*100
        response_dict[label.description] = "{:.2f}".format(label.score*100)
        # "{:.2f}".format(3.1415926)

    return jsonify(response_dict), 200

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

if __name__ == '__main__':
    app.run(port = port) #having debug mode on crashed the application if not opened from one directory above the app.py file
