const socket = new WebSocket('ws://192.168.229.52:8080'); 

// Check if the connection is successful
socket.addEventListener('open', function () {
    console.log("Connected to WebSocket server.");
});

// Handle incoming messages from the server (broadcast messages from other tabs)
socket.addEventListener('message', function (event) {
    const chatBox = document.getElementById("chat-box");

    // Ensure the incoming message is treated as a string or JSON object
    let messageData = JSON.parse(event.data);

    // Handle the mood and style update based on incoming message
    updateMoodAndStyleFromBroadcast(messageData);

    // Display the message
    displayMessage(messageData.text);
});

// Function to display a message in the chat box
function displayMessage(msg) {
    const chatBox = document.getElementById("chat-box");
    const userMessage = document.createElement("div");
    userMessage.classList.add("user-message");
    userMessage.textContent = msg;
    chatBox.appendChild(userMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Handle the send button click event
document.getElementById("send-button").addEventListener("click", function () {
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value.trim();

    if (message === "") return; // Skip empty messages

    // Analyze mood and update UI accordingly
    const moodData = updateMoodAndStyle(message);

    // Send the message and mood data to the server
    const messageData = {
        text: message,
        color: moodData.color,
        animation: moodData.animation
    };
    socket.send(JSON.stringify(messageData));
    console.log("Message sent: " + message);

    // Display the user's message locally
    displayMessage(message);

    // Clear the input field after sending
    messageInput.value = "";
});

// Function to determine mood and update UI
function updateMoodAndStyle(message) {
    const chatBox = document.getElementById("chat-box");
    const moodDisplay = document.getElementById("mood-display");

    let mood = "neutral";
    let color = "#e0e0e0"; // Default grey
    let animation = ""; // No animation

    if (message.includes("happy") || message.includes("great") || message.includes("excited")|| message.includes("good")|| message.includes("joy") || message.includes("glad")) {
        mood = "happy";
        color = ""; // Bright orange
        animation = "pulse-happy 5s infinite";
    } else if (message.includes("sad") || message.includes("unhappy") || message.includes("depressed") || message.includes("upset") || message.includes("miserable") || message.includes("low") || message.includes("dont't")) {
        mood = "sad";
        color = ""; // Soft blue
        animation = "pulse-sad 5s infinite";
    } else if (message.includes("love") || message.includes("like") || message.includes("adore") || message.includes("fond of") || message.includes("care") || message.includes("cherish")) {
        mood = "love";
        color = ""; // pink
        animation = "pulse-love 3s infinite";
    } else if (message.includes("angry") || message.includes("anger") || message.includes("mad") || message.includes("upset") || message.includes("frustrated") || message.includes("irritated")) {
        mood = "anger";
        color = ""; // red
        animation = "pulse-angry 3s infinite";
    } 

    // Update background and animations based on mood
    document.body.style.backgroundColor = color;
    chatBox.style.animation = animation;

    // Update mood display text
    moodDisplay.textContent = `Mood: ${mood}`;

    // Return the mood data
    return { color, animation };
}

// Function to update UI when receiving broadcasted mood data
function updateMoodAndStyleFromBroadcast(moodData) {
    const chatBox = document.getElementById("chat-box");

    document.body.style.backgroundColor = moodData.color;
    chatBox.style.animation = moodData.animation;
}
