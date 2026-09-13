const button = document.getElementById("startBtn");
const status = document.getElementById("status");

button.addEventListener("click", () => {
    status.textContent = "Inspection started!";
});