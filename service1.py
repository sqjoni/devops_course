import os
import subprocess
import requests
from flask import Flask, jsonify

app = Flask(__name__)

# Function to get system info
def get_system_info():
    ip_address = subprocess.getoutput("hostname -I").strip()
    processes = subprocess.getoutput("ps -ax")
    disk_space = subprocess.getoutput("df -h /")
    uptime = subprocess.getoutput("uptime -p")
    return {
        "IP Address": ip_address,
        "Processes": processes,
        "Disk Space": disk_space,
        "Uptime": uptime
    }

@app.route('/')
def index():
    # Gather information for Service1
    service1_info = get_system_info()

    # Communicate with Service2 to gather its info
    try:
        response = requests.get("http://service2:5000/")
        service2_info = response.json()
    except requests.exceptions.RequestException as e:
        service2_info = {"error": "Service2 not reachable"}

    # Return combined info from Service1 and Service2
    return jsonify({
        "Service1": service1_info,
        "Service2": service2_info
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8199)
