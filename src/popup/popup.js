const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const status = document.getElementById("status");

async function sendInspectionMessage(action) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.id) {
        throw new Error("No active tab is available for inspection.");
    }

    await chrome.tabs.sendMessage(tab.id, { action });
}

async function handleInspectionAction(action, message) {
    try {
        await sendInspectionMessage(action);
        status.textContent = message;
    } catch (error) {
        status.textContent = "This page cannot be inspected.";
        console.error(`Unable to send ${action}:`, error);
    }
}

startBtn?.addEventListener("click", () => {
    handleInspectionAction("START_INSPECTION", "Inspection mode active!");
});

stopBtn?.addEventListener("click", () => {
    handleInspectionAction("STOP_INSPECTION", "Inspection stopped.");
});