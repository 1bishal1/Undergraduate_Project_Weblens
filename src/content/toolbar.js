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
    let style = document.getElementById("weblens-toolbar-styles");
    if (!style) {
        style = document.createElement("style");
        style.id = "weblens-toolbar-styles";
        document.head.appendChild(style);
    }

    style.textContent = `
        #weblens-toolbar,
        #weblens-toolbar * {
            box-sizing: border-box !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        }

        #weblens-toolbar * {
            margin: 0 !important;
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

            padding: 12px 22px !important;

            display: flex !important;
            align-items: center !important;

            gap: 20px !important;

            box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45) !important;

            user-select: none !important;

            animation: weblens-slide-down 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;

            line-height: 1.2 !important;
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

        #weblens-toolbar .weblens-brand {
            display: flex !important;
            align-items: center !important;

            padding: 0 4px 0 2px !important;

            font-size: 18px !important;
            font-weight: 700 !important;
            letter-spacing: -0.35px !important;

            white-space: nowrap !important;
            flex-shrink: 0 !important;
        }

        #weblens-toolbar .weblens-brand-web {
            color: #ffffff !important;
        }

        #weblens-toolbar .weblens-brand-lens {
            color: #38bdf8 !important;
        }

        #weblens-toolbar .weblens-divider {
            width: 1px !important;
            height: 32px !important;

            background: rgba(255, 255, 255, 0.14) !important;

            flex-shrink: 0 !important;
            margin: 0 4px !important;
        }

        #weblens-toolbar .weblens-nav-buttons {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            align-items: center !important;

            gap: 8px !important;

            padding: 6px !important;

            background: rgba(15, 23, 42, 0.65) !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            border-radius: 9999px !important;
            flex-shrink: 0 !important;
        }

        #weblens-toolbar button.weblens-nav-btn {
            appearance: none !important;
            -webkit-appearance: none !important;

            background: transparent !important;

            border: 1px solid transparent !important;

            color: #94a3b8 !important;

            padding: 9px 18px !important;

            min-height: 36px !important;
            height: auto !important;
            width: auto !important;
            min-width: 0 !important;

            border-radius: 9999px !important;

            font-size: 13px !important;
            font-weight: 500 !important;
            line-height: 1.25 !important;

            cursor: pointer !important;

            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;

            gap: 6px !important;

            transition:
                background 0.2s ease,
                border-color 0.2s ease,
                color 0.2s ease,
                box-shadow 0.2s ease !important;

            outline: none !important;

            white-space: nowrap !important;
            flex: 0 0 auto !important;
            flex-shrink: 0 !important;
        }

        #weblens-toolbar button.weblens-nav-btn span {
            display: block !important;
            padding: 0 !important;
            line-height: 1.25 !important;
            pointer-events: none !important;
        }

        #weblens-toolbar button.weblens-nav-btn:hover {
            color: #f1f5f9 !important;

            background: rgba(255, 255, 255, 0.06) !important;

            border-color: rgba(255, 255, 255, 0.1) !important;
        }

        #weblens-toolbar button.weblens-nav-btn:focus-visible {
            outline: 2px solid #38bdf8 !important;
            outline-offset: 2px !important;
        }

        #weblens-toolbar button.weblens-nav-btn.active {
            background: #1e293b !important;

            border: 1px solid rgba(56, 189, 248, 0.45) !important;

            color: #ffffff !important;

            font-weight: 600 !important;

            box-shadow:
                0 0 0 1px rgba(56, 189, 248, 0.15),
                0 4px 14px rgba(0, 0, 0, 0.35) !important;
        }

        #weblens-toolbar button.weblens-nav-btn:active:not(.active) {
            background: rgba(255, 255, 255, 0.04) !important;
            transform: scale(0.98) !important;
        }

        #weblens-toolbar button.weblens-close-btn {
            appearance: none !important;
            -webkit-appearance: none !important;

            background: rgba(244, 63, 94, 0.1) !important;

            border: 1px solid rgba(244, 63, 94, 0.5) !important;

            color: #f87171 !important;

            padding: 9px 18px !important;

            min-height: 36px !important;
            height: auto !important;
            width: auto !important;

            border-radius: 9999px !important;

            font-size: 13px !important;
            font-weight: 600 !important;
            line-height: 1.25 !important;

            cursor: pointer !important;

            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;

            gap: 8px !important;

            transition: all 0.2s ease !important;

            outline: none !important;

            white-space: nowrap !important;
            flex-shrink: 0 !important;
        }

        #weblens-toolbar button.weblens-close-btn svg {
            flex-shrink: 0 !important;
            display: block !important;
        }

        #weblens-toolbar button.weblens-close-btn span {
            padding: 0 !important;
            line-height: 1.25 !important;
        }

        #weblens-toolbar button.weblens-close-btn:hover {
            background: rgba(244, 63, 94, 0.2) !important;

            border-color: rgba(244, 63, 94, 0.75) !important;

            color: #ff8585 !important;

            box-shadow: 0 4px 12px rgba(244, 63, 94, 0.25) !important;
        }
    `;
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
