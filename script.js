<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>WebSocket Trade Listener</title>
<style>
    #status {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: green;
        display: inline-block;
    }
</style>
</head>
<body>

<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.3.1/socket.io.js"></script>

<h1>WebSocket Trade Listener</h1>

<button onclick="startListening()">Start Listening</button>
<div>
    Status: <div id="status"></div>
    Trade Count: <span id="tradeCount">0</span>
</div>

<script>
function startListening() {
    const socket = io('wss://client-api-2-74b1891ee9f9.herokuapp.com', {
        transports: ['websocket'],
        upgrade: false
    });

    const statusIndicator = document.getElementById('status');
    const tradeCountDisplay = document.getElementById('tradeCount');

    socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        statusIndicator.style.backgroundColor = 'green';
    });

    socket.on('tradeCreated', (newTrade) => {
        const wallet = newTrade.user;

        // Construct the URL for the POST request based on the received wallet
        const postUrl = `https://client-api-2-74b1891ee9f9.herokuapp.com/following/${wallet}`;

        // Send a POST request to the constructed URL
        fetch(postUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiRTZmb0xjU29oQzZEN1lXQm8xUjJLZ3dxOExxa1d0ZXMxVGFFdFVhc2tzeGciLCJpYXQiOjE3MTQyMjY1NTAsImV4cCI6MTcxNjgxODU1MH0.-j0mv3epyXhM0Y_gjCqt2dXCayleoSAXO7Nma80pIbA'
            },
            body: JSON.stringify({ /* Add any data needed for the request body */ })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

        // Increment trade count and update display
        let tradeCount = parseInt(tradeCountDisplay.textContent) || 0;
        tradeCount++;
        tradeCountDisplay.textContent = tradeCount;

        // Check if trade count reaches 201 and change status indicator color
        if (tradeCount >= 201) {
            statusIndicator.style.backgroundColor = 'red';
        }
    });
}
</script>

</body>
</html>
