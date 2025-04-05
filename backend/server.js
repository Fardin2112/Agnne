const { SerialPort } = require('serialport');
const { WebSocketServer } = require('ws');

const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 });
const wss = new WebSocketServer({ port: 8080 });
let clients = [];
let dataBuffer = '';

port.on('open', () => console.log('Serial port opened'));
port.on('data', (data) => {
    dataBuffer += data.toString();
    const lines = dataBuffer.split('\n');
    for (let i = 0; i < lines.length - 1; i++) {
        const trimmedLine = lines[i].trim();
        if (trimmedLine) {
            console.log('Raw data received:', trimmedLine); // Log full lines only
            const [key, value] = trimmedLine.split('=');
            if (key && value !== undefined) {
                console.log(`Parsed: ${key}=${value}`);
                broadcast(`${key}=${value}`);
            }
        }
    }
    dataBuffer = lines[lines.length - 1]; // Keep incomplete line in buffer
});
port.on('error', (err) => console.error('Serial port error:', err));

wss.on('connection', (ws) => {
    console.log('Client connected');
    clients.push(ws);
    ws.on('message', (message) => {
        const cmd = message.toString();
        console.log(`Sending to ESP32: ${cmd}`);
        port.write(`${cmd}\n`);
    });
    ws.on('close', () => clients = clients.filter(client => client !== ws));
});

function broadcast(message) {
    console.log('Broadcasting:', message);
    clients.forEach(client => {
        if (client.readyState === 1) client.send(message);
    });
}
