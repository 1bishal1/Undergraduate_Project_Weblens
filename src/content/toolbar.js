(function () {
    const NAVBAR_ID = "weblens-toolbar";
    let toolbarElement;
    let activeTab = "font"; // 'font' | 'colors' | 'coming_soon'

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
                top: 18px !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                z-index: 2147483647 !important;
                background: rgba(15, 23, 42, 0.94) !important;
                backdrop-filter: blur(16px) !important;
                -webkit-backdrop-filter: blur(16px) !important;
                border: 1px solid rgba(255, 255, 255, 0.16) !important;
                border-radius: 9999px !important;
                padding: 10px 22px !important;
                display: flex !important;
                align-items: center !important;
                gap: 20px !important;
                box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.2) !important;
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
            .weblens-brand {
                display: flex !important;
                align-items: center !important;
                padding: 0 4px !important;
            }
            .weblens-brand-title {
                color: #ffffff !important;
                font-weight: 700 !important;
                font-size: 15px !important;
                letter-spacing: -0.3px !important;
            }
            .weblens-divider {
                width: 1px !important;
                height: 24px !important;
                background: rgba(255, 255, 255, 0.18) !important;
            }
            .weblens-nav-buttons {
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
                background: rgba(255, 255, 255, 0.04) !important;
                padding: 6px 8px !important;
                border-radius: 9999px !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
            }
            .weblens-nav-btn {
                background: rgba(255, 255, 255, 0.08) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                color: #e2e8f0 !important;
                padding: 10px 22px !important;
                border-radius: 9999px !important;
                font-size: 13.5px !important;
                font-weight: 500 !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                transition: all 0.2s ease !important;
                outline: none !important;
                white-space: nowrap !important;
            }
            .weblens-nav-btn:hover {
                color: #ffffff !important;
                background: rgba(255, 255, 255, 0.16) !important;
                border-color: rgba(255, 255, 255, 0.2) !important;
            }
            .weblens-nav-btn.active {
                background: #ffffff !important;
                border: 1px solid #ffffff !important;
                color: #000000 !important;
                font-weight: 600 !important;
                box-shadow: 0 4px 14px rgba(255, 255, 255, 0.25) !important;
            }
            .weblens-close-btn {
                background: rgba(239, 68, 68, 0.15) !important;
                border: 1px solid rgba(239, 68, 68, 0.35) !important;
                color: #f87171 !important;
                padding: 10px 18px !important;
                border-radius: 9999px !important;
                font-size: 13px !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                gap: 7px !important;
                transition: all 0.2s ease !important;
                outline: none !important;
            }
            .weblens-close-btn:hover {
                background: rgba(239, 68, 68, 0.88) !important;
                border-color: rgba(239, 68, 68, 0.9) !important;
                color: #ffffff !important;
                box-shadow: 0 4px 12px rgba(239, 68, 68, 0.45) !important;
            }
        `;
        document.head.appendChild(style);
    }

    function createToolbar() {
        injectStyles();
        if (toolbarElement) return;

        toolbarElement = document.createElement("div");
        toolbarElement.id = NAVBAR_ID;
        toolbarElement.innerHTML = `
            <div class="weblens-brand">
                <span class="weblens-brand-title">WebLens</span>
            </div>

            <div class="weblens-divider"></div>

            <div class="weblens-nav-buttons">
                <button class="weblens-nav-btn ${activeTab === 'font' ? 'active' : ''}" data-tab="font">
                    Font / Size
                </button>

                <button class="weblens-nav-btn ${activeTab === 'colors' ? 'active' : ''}" data-tab="colors">
                    Colors
                </button>

                <button class="weblens-nav-btn ${activeTab === 'coming_soon' ? 'active' : ''}" data-tab="coming_soon">
                    Coming Soon...
                </button>
            </div>

            <div class="weblens-divider"></div>

            <button class="weblens-close-btn" id="weblens-stop-inspection-btn" title="Stop Inspection">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Stop
            </button>
        `;

        const navBtns = toolbarElement.querySelectorAll(".weblens-nav-btn");
        navBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                const tab = btn.getAttribute("data-tab");
                activeTab = tab;
                navBtns.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
            });
        });

        const stopBtn = toolbarElement.querySelector("#weblens-stop-inspection-btn");
        stopBtn.addEventListener("click", () => {
            if (window.WebLensInspector && typeof window.WebLensInspector.stop === "function") {
                window.WebLensInspector.stop();
            }
        });

        (document.body || document.documentElement).appendChild(toolbarElement);
    }

    function show() {
        if (!toolbarElement) {
            createToolbar();
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

    window.WebLensToolbar = { show, hide, contains };
})();
