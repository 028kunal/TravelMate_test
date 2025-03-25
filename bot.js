// script.js
const API_KEY = 'AIzaSyANhAaLi6TA732zRLOAxFxx7vJIhVR0958';
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
// const TEMPERATURE = 0.7; // Removed temperature constant
const CHAT_HISTORY_KEY = 'aiChatHistory';

// Function to send user input to Gemini API
async function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    appendMessage("user", userInput);
    document.getElementById("user-input").value = "";

    try {
        const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userInput }] }] // Updated for Gemini Pro API
                // temperature: TEMPERATURE // Removed temperature from request body
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData?.error?.message || "Failed to fetch response from AI.";
            appendMessage("bot", `Error: ${errorMessage}`);
            console.error("API Error:", errorData);
            return;
        }

        const data = await response.json();
        let botMessage = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";

        // Format the bot message into organized structure
        botMessage = formatOrganizedText(botMessage);

        appendMessage("bot", botMessage);
        saveChatHistory(userInput, botMessage); // Save chat history
    } catch (error) {
        appendMessage("bot", "Error connecting to AI. Please try again later.");
        console.error("Fetch Error:", error);
    }
}

// Append messages to chat box
function appendMessage(sender, message) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.className = sender === "user" ? "user-message" : "bot-message";
    messageDiv.innerHTML = `<p>${message}</p>`; // Wrap message in a paragraph for potential styling
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message
}

// Allow sending message with "Enter" key
function handleKeyPress(event) {
    if (event.key === "Enter") sendMessage();
}

// Function to save chat history to local storage
function saveChatHistory(userMsg, botMsg) {
    const newEntry = { user: userMsg, bot: botMsg };
    const existingHistoryString = localStorage.getItem(CHAT_HISTORY_KEY);
    let history = existingHistoryString ? JSON.parse(existingHistoryString) : [];
    history.push(newEntry);
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
}

// Function to load and display chat history
function loadChatHistory() {
    const chatBox = document.getElementById("chat-box");
    const historyString = localStorage.getItem(CHAT_HISTORY_KEY);
    if (historyString) {
        const history = JSON.parse(historyString);
        history.forEach(entry => {
            appendMessage("user", entry.user);
            appendMessage("bot", entry.bot);
        });
    }
}

// Function to format text into an organized structure
function formatOrganizedText(text) {
    if (!text) return "";
    const lines = text.split('\n');
    let formattedText = '';
    let inList = false;

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // Check for potential headings (e.g., starting with uppercase words)
        if (trimmedLine.length > 0 && /^[A-Z][a-z ]+$/.test(trimmedLine) && trimmedLine.split(' ').length <= 5) {
            if (inList) {
                formattedText += '</ol>';
                inList = false;
            }
            formattedText += `<b>${trimmedLine}</b><br>`;
        } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
            if (!inList) {
                formattedText += '<ol type="1">'; // Using ordered list for now, you can change to unordered (ul)
                inList = true;
            }
            formattedText += `<li>${trimmedLine.substring(2).trim()}</li>`;
        } else {
            if (inList) {
                formattedText += '</ol>';
                inList = false;
            }
            formattedText += `${trimmedLine}<br>`;
        }
    }

    if (inList) {
        formattedText += '</ol>';
    }

    return formattedText;
}

// Function to clear the chat
function clearChat() {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = ''; // Clear the content of the chat box
    localStorage.removeItem(CHAT_HISTORY_KEY); // Optionally clear the history from local storage
}

// Create and append the "View History" button
document.addEventListener('DOMContentLoaded', () => {
    loadChatHistory(); // Load initial chat history

    const newChatButton = document.getElementById('new-chat-button');
    if (newChatButton) {
        newChatButton.addEventListener('click', clearChat);
    }

    // Removed the "View History" button for now as it doesn't fit the Gemini layout
    // const chatContainer = document.querySelector('.chat-container');
    // const viewHistoryButton = document.createElement('button');
    // viewHistoryButton.textContent = 'View History';
    // viewHistoryButton.id = 'view-history-button';
    // chatContainer.appendChild(viewHistoryButton);
    //
    // viewHistoryButton.addEventListener('click', () => {
    //     window.location.href = 'chat_history.html'; // Create a new HTML for history
    // });
});