(function () {
    const NAVBAR_ID = "weblens-toolbar";
    let toolbarElement;
    let activeTab = "font"; // 'font' | 'colors' | 'coming_soon'
    let toolbarHtmlPromise = null;

    window.WebLensState = window.WebLensState || {};
    window.WebLensState.activeTab = activeTab;

    function fetchToolbarHTML() {
        if (!toolbarHtmlPromise) {
            const htmlUrl = chrome.runtime.getURL("src/content/toolbar.html");
            toolbarHtmlPromise = fetch(htmlUrl)
                .then((res) => res.text())
                .catch((err) => {
                    console.error("WebLens: Failed to load toolbar.html", err);
                    return null;
                });
        }
        return toolbarHtmlPromise;
    }

    // Pre-fetch toolbar HTML on content script initialization
    fetchToolbarHTML();

    function injectStyles() {
    if (document.getElementById("weblens-toolbar-styles")) return;

    const style = document.createElement("style");
    style.id = "weblens-toolbar-styles";

    style.textContent = `
        #weblens-toolbar * {
            box-sizing: border-box !important;
            margin: 0 !important;
            padding: 0 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        }

        #weblens-toolbar {
            position: fixed !important;
            top: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            z-index: 2147483647 !important;

            background: #0c1322 !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;

            border: 1px solid rgba(255, 255, 255, 0.12) !important;
            border-radius: 9999px !important;

            padding: 10px 20px !important;

            display: flex !important;
            align-items: center !important;

            gap: 16px !important;

            box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45) !important;

            user-select: none !important;

            animation: weblens-slide-down 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;

            line-height: 1 !important;
        }

        @keyframes weblens-slide-down {
            from {
                opacity: 0;
                transform: translate(-50%, -14px) scale(0.97);
            }

            to {
                opacity: 1;
                transform: translate(-50%, 0) scale(1);
            }
        }

        .weblens-brand {
            display: flex !important;
            align-items: center !important;

            padding: 0 4px !important;

            font-size: 20px !important;
            font-weight: 700 !important;
            letter-spacing: -0.4px !important;

            white-space: nowrap !important;
        }

        .weblens-brand-web {
            color: #ffffff !important;
        }

        .weblens-brand-lens {
            color: #38bdf8 !important;
        }

        .weblens-divider {
            width: 1px !important;
            height: 26px !important;

            background: rgba(255, 255, 255, 0.15) !important;

            flex-shrink: 0 !important;
        }

        .weblens-nav-buttons {
            display: flex !important;
            align-items: center !important;

            gap: 10px !important;
        }

        .weblens-nav-btn {
            background: #172133 !important;

            border: 1px solid rgba(255, 255, 255, 0.1) !important;

            color: #e2e8f0 !important;

            padding: 7px 14px !important;

            min-height: 30px !important;

            border-radius: 9px !important;

            font-size: 13px !important;
            font-weight: 500 !important;
            line-height: 1 !important;

            cursor: pointer !important;

            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;

            gap: 6px !important;

            transition:
                background 0.2s ease,
                border-color 0.2s ease,
                color 0.2s ease,
                transform 0.2s ease !important;

            outline: none !important;

            white-space: nowrap !important;
        }

        .weblens-nav-btn:hover {
            color: #ffffff !important;

            background: #1f2c42 !important;

            border-color: rgba(255, 255, 255, 0.18) !important;

            transform: translateY(-1px) !important;
        }

        .weblens-nav-btn:focus-visible {
            outline: 2px solid #38bdf8 !important;
            outline-offset: 2px !important;
        }

        .weblens-nav-btn.active,
        .weblens-nav-btn:active {
            background: #000000 !important;

            border: 1px solid rgba(255, 255, 255, 0.28) !important;

            color: #ffffff !important;

            font-weight: 600 !important;

            box-shadow:
                0 2px 10px rgba(0, 0, 0, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;

            transform: translateY(0) !important;
        }

        .weblens-close-btn {
            background: rgba(244, 63, 94, 0.1) !important;

            border: 1px solid rgba(244, 63, 94, 0.5) !important;

            color: #f87171 !important;

            padding: 8px 18px !important;

            min-height: 30px !important;

            border-radius: 9999px !important;

            font-size: 14px !important;
            font-weight: 600 !important;

            cursor: pointer !important;

            display: flex !important;
            align-items: center !important;

            gap: 7px !important;

            transition: all 0.2s ease !important;

            outline: none !important;

            white-space: nowrap !important;
        }

        .weblens-close-btn:hover {
            background: rgba(244, 63, 94, 0.2) !important;

            border-color: rgba(244, 63, 94, 0.75) !important;

            color: #ff8585 !important;

            box-shadow: 0 4px 12px rgba(244, 63, 94, 0.25) !important;
        }
    `;

    document.head.appendChild(style);
}
    async function createToolbar() {
        injectStyles();
        if (toolbarElement) return toolbarElement;

        const html = await fetchToolbarHTML();
        if (!html) return null;

        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = html.trim();
        toolbarElement = tempContainer.firstElementChild;

        if (!toolbarElement) return null;

        const navBtns = toolbarElement.querySelectorAll(".weblens-nav-btn");
        navBtns.forEach((btn) => {
            const tab = btn.getAttribute("data-tab");
            if (tab === activeTab) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }

            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const selectedTab = btn.getAttribute("data-tab");
                activeTab = selectedTab;
                window.WebLensState = window.WebLensState || {};
                window.WebLensState.activeTab = selectedTab;

                navBtns.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");

                if (window.WebLensHoverPopup && typeof window.WebLensHoverPopup.refresh === "function") {
                    window.WebLensHoverPopup.refresh();
                }
            });
        });

        const stopBtn = toolbarElement.querySelector("#weblens-stop-inspection-btn");
        if (stopBtn) {
            stopBtn.addEventListener("click", () => {
                if (window.WebLensInspector && typeof window.WebLensInspector.stop === "function") {
                    window.WebLensInspector.stop();
                }
            });
        }

        (document.body || document.documentElement).appendChild(toolbarElement);
        return toolbarElement;
    }

    async function show() {
        if (!toolbarElement) {
            await createToolbar();
        } else {
            toolbarElement.style.display = "flex";
        }
    }

    function hide() {
        if (toolbarElement) {
            toolbarElement.remove();
            toolbarElement = null;
        }
    }

    function contains(element) {
        return toolbarElement ? toolbarElement.contains(element) : false;
    }

    function getActiveTab() {
        return (window.WebLensState && window.WebLensState.activeTab) || activeTab;
    }

    window.WebLensToolbar = { show, hide, contains, getActiveTab };
})();
