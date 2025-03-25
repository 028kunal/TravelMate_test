document.getElementById("chatbot-icon").addEventListener("click", function () {
    document.getElementById("chat-window").classList.toggle("hidden");
});

document.getElementById("close-chat").addEventListener("click", function () {
    document.getElementById("chat-window").classList.add("hidden");
});
