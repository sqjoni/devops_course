const express = require('express');
const { execSync } = require('child_process');

const app = express();

// Function to get system info
function getSystemInfo() {
    const ipAddress = execSync('hostname -I').toString().trim();
    const processes = execSync('ps -ax').toString();
    const diskSpace = execSync('df -h /').toString();
    const uptime = execSync('uptime -p').toString().trim();

    return {
        "IP Address": ipAddress,
        "Processes": processes,
        "Disk Space": diskSpace,
        "Uptime": uptime
    };
}

app.get('/', (req, res) => {
    const systemInfo = getSystemInfo();
    res.json(systemInfo);
});

app.listen(5000, () => {
    console.log('Service2 running on port 5000');
});
