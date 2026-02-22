AeroAssist-NEFET
A demo MVP of NEFET, presented as a startup: multi-camera AI monitoring system with real-time object detection and space data integration, featuring 3 independent simultaneous camera streams, each having a specialized detection model. Users are allowed to start and stop streams, take snapshots and view real-time stats. Special features include simulated live ISS tracking, NASA APOD and space weather updates. The demo website supports dark and light themes and Russian/English support.

Prerequisites: Python 3.8+;
Webcam or IP cameras

Running the website: 
git clone https://github.com/yourusername/aeroassist.git #first, clone the repository
cd NEFET

python -m venv venv #then, create a virtual environment
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

pip install -r requirements.txt #install provided dependencies 

#recreate the project/folder structure of the github repository inside the virtual environment

python app.py #paste to terminal

#open browser on http://localhost:5001

#if needed, edit config.py to modify camera limits, upload directory, NASA API key and port settings

API endpoints: /api/cameras -	GET/POST- List/add cameras
/api/cameras/<id>/toggle - POST -	Start/stop camera
/api/cameras/<id>/snapshot - POST -	Capture image
/api/space/iss - GET - ISS location
/video_feed/<id> - GET - Video Stream

Deployment, Docker: docker build -t aeroassist .
docker run -p 5001:5001 --device=/dev/video0 aeroassist

Github: git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/aeroassist.git
git push -u origin main

Lisence: MIT
