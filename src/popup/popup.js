const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const status = document.getElementById("status");

if (startBtn) {
    startBtn.addEventListener("click", async () => {
        status.textContent = "Inspection mode active!";

        if (typeof chrome !== "undefined" && chrome.tabs) {
            try {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tab && tab.id) {
                    chrome.tabs.sendMessage(tab.id, { action: "START_INSPECTION" }, async (response) => {
                        if (chrome.runtime.lastError) {
                            await chrome.scripting.executeScript({
                                target: { tabId: tab.id },
                                files: ["src/content/content.js"]
                            });
                            chrome.tabs.sendMessage(tab.id, { action: "START_INSPECTION" });
                        }
                    });
                }
            } catch (err) {
                console.error("Error activating inspection mode:", err);
            }
        }
    });
}

if (stopBtn) {
    stopBtn.addEventListener("click", async () => {
        status.textContent = "Inspection stopped.";

        if (typeof chrome !== "undefined" && chrome.tabs) {
            try {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tab && tab.id) {
                    chrome.tabs.sendMessage(tab.id, { action: "STOP_INSPECTION" });
                }
            } catch (err) {
                console.error("Error stopping inspection mode:", err);
            }
        }
    });
}