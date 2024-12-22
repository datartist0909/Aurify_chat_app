const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// Create an HTTP server
const server = http.createServer((req, res) => {
    let filePath = './index.html'; // Default to index.html

    // Match the requested file
    if (req.url === '/script.js') {
        filePath = './script.js';
    } else if (req.url === '/style.css') {
        filePath = './style.css';
    }

    // Serve the requested file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        } else {
            const ext = path.extname(filePath);
            const contentType = {
                '.html': 'text/html',
                '.js': 'application/javascript',
                '.css': 'text/css',
            }[ext];

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

// Attach WebSocket server to the HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('A new client connected.');

    // Send a welcome message to the client
    ws.send('Welcome to the chat!');

    // Listen for messages from the client
    ws.on('message', (message) => {
        console.log('Received message:', message);

        // Ensure the message is a string before broadcasting
        if (Buffer.isBuffer(message)) {
            message = message.toString(); // Convert Buffer to string
        }

        let mood = "neutral";
        let color = "#e0e0e0";
        let animation = "";
        if (message.includes("happy") || message.includes("great") || message.includes("good")|| message.includes("joy") || message.includes("glad")) {
            mood = "happy";
            color = "#ff6000"; // Bright orange
            animation = "pulse-happy 5s infinite";
        } else if (message.includes("sad") || message.includes("unhappy") || message.includes("depressed") || message.includes("upset") || message.includes("miserable") || message.includes("low")) {
            mood = "sad";
            color = "#0096c7"; // Soft blue
            animation = "pulse-sad 5s infinite";
        } else if (message.includes("love") || message.includes("crush") || message.includes("heart")) {
            mood = "love";
            color = "#ff97b7"; // Pink
            animation = "pulse-love 3s infinite";
        } else if (message.includes("angry") || message.includes("anger") || message.includes("mad") || message.includes("upset") || message.includes("frustrated") || message.includes("irritated")) {
            mood = "anger";
            color = "#c70512"; // red
            animation = "pulse-angry 3s infinite";
        } 

        const broadcastMessage = JSON.stringify({ 
            text: message,
            mood: mood,
            color: color,
            animation: animation
        
        });


        // Broadcast the message to all connected clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message); // Send message as string
                console.log('Broadcasting message:', message); // Debugging
            }
        });
    });

    // Handle closing the connection
    ws.on('close', () => {
        console.log('A client disconnected.');
    });
});

// Start the server on port 8080
server.listen(8080, () => {
    console.log('Server is running on http://192.168.229.52:8080');
});
