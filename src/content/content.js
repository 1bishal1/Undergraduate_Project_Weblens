(function () {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "START_INSPECTION") {
            window.WebLensInspector.start();
            sendResponse({ active: true });
        }

        if (message.action === "STOP_INSPECTION") {
            window.WebLensInspector.stop();
            sendResponse({ active: false });
        }

        return true;
    });
})();