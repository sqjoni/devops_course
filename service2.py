from flask import Flask, jsonify
import subprocess

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

@app.route('/', methods=['GET'])
def index():
    system_info = get_system_info()
    return jsonify(system_info)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
