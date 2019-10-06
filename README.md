#rideshare-customer-finder
My journey into AppDev as I attempt to create a vision and ml based tool for detecting rideshare customers trying to hail down a ride

##Architecture
Under construction...

##Running the App Locally
This app was developed on locally running docker containers to emulate the intended google cloud services based production environment (Google App Engine in this case). To simplifiy deployment between the local and cloud environments, I opted to to use cloud storage for all file storage, even when running locally. This means you'll need to set up a google cloud cloud project, bucket, and service accounts to get this to run correctly on your local machine.
 

####Install nodejs services
Under contruction...

####Install python services
Under contruction...

####Create the .env file
The .env file is used by docker to set the environment variables for each service. If you aren't using docker and choose to run each services in its own shell, you'll need to a set the environment variables, either manually or my using automation tools (e.g. dotenv). I've set this up for some but not all of the services. See the "start_local" script in "package.json" for the node-service.

Rename the the .env-example file to .env and update with your own ports, api keys, and credentials.

####Setting up services with docker-compose

####Starting the applciation

