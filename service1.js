const express = require('express');
const { execSync } = require('child_process');
const axios = require('axios');

const app = express();
const PORT = 8199;

let isSleeping = false;

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

app.get('/request', async (req, res) => {
    if (isSleeping) {
        return res.status(503).json({ message: "Service1 is sleeping" });
    }

    const service1Info = getSystemInfo();

    let service2Info;
    try {
        const response = await axios.get('http://service2:5000/');
        service2Info = response.data;
    } catch (error) {
        service2Info = { error: "Service2 not reachable" };
    }

    res.json({
        "Service1": service1Info,
        "Service2": service2Info
    });

    isSleeping = true;
    setTimeout(() => {
        isSleeping = false;
    }, 2000);
});

app.post('/stop', (req, res) => {
    res.send('Stopping services...');
    setTimeout(() => {
        process.exit(0);
    }, 2000);
});

app.listen(PORT, () => {
    console.log(`Service1 running on port ${PORT}`);
});
