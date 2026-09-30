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
                top: 16px !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                z-index: 2147483647 !important;
                background: rgba(15, 23, 42, 0.92) !important;
                backdrop-filter: blur(16px) !important;
                -webkit-backdrop-filter: blur(16px) !important;
                border: 1px solid rgba(255, 255, 255, 0.15) !important;
                border-radius: 40px !important;
                padding: 6px 8px 6px 14px !important;
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45), 0 2px 6px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
                user-select: none !important;
                animation: weblens-slide-down 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
                line-height: 1 !important;
            }
            @keyframes weblens-slide-down {
                from {
                    opacity: 0;
                    transform: translate(-50%, -12px) scale(0.98);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, 0) scale(1);
                }
            }
            .weblens-brand {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                padding-right: 4px !important;
            }
            .weblens-brand-logo {
                width: 24px !important;
                height: 24px !important;
                background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                box-shadow: 0 0 10px rgba(59, 130, 246, 0.5) !important;
            }
            .weblens-brand-title {
                color: #ffffff !important;
                font-weight: 700 !important;
                font-size: 14px !important;
                letter-spacing: -0.3px !important;
            }
            .weblens-status-dot {
                width: 6px !important;
                height: 6px !important;
                background-color: #10b981 !important;
                border-radius: 50% !important;
                box-shadow: 0 0 6px #10b981 !important;
            }
            .weblens-divider {
                width: 1px !important;
                height: 20px !important;
                background: rgba(255, 255, 255, 0.15) !important;
            }
            .weblens-nav-buttons {
                display: flex !important;
                align-items: center !important;
                gap: 4px !important;
                background: rgba(255, 255, 255, 0.06) !important;
                padding: 3px !important;
                border-radius: 30px !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
            }
            .weblens-nav-btn {
                background: transparent !important;
                border: none !important;
                color: rgba(255, 255, 255, 0.75) !important;
                padding: 7px 14px !important;
                border-radius: 20px !important;
                font-size: 13px !important;
                font-weight: 500 !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                gap: 6px !important;
                transition: all 0.18s ease !important;
                outline: none !important;
                white-space: nowrap !important;
            }
            .weblens-nav-btn:hover {
                color: #ffffff !important;
                background: rgba(255, 255, 255, 0.1) !important;
            }
            .weblens-nav-btn.active {
                background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
                color: #ffffff !important;
                font-weight: 600 !important;
                box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4) !important;
            }
            .weblens-close-btn {
                background: rgba(239, 68, 68, 0.15) !important;
                border: 1px solid rgba(239, 68, 68, 0.3) !important;
                color: #f87171 !important;
                padding: 7px 12px !important;
                border-radius: 20px !important;
                font-size: 12px !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                gap: 5px !important;
                transition: all 0.18s ease !important;
                outline: none !important;
            }
            .weblens-close-btn:hover {
                background: rgba(239, 68, 68, 0.85) !important;
                color: #ffffff !important;
                box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4) !important;
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
                <div class="weblens-brand-logo">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
                <span class="weblens-brand-title">WebLens</span>
                <span class="weblens-status-dot" title="Inspection Active"></span>
            </div>

            <div class="weblens-divider"></div>

            <div class="weblens-nav-buttons">
                <button class="weblens-nav-btn ${activeTab === 'font' ? 'active' : ''}" data-tab="font">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="4 7 4 4 20 4 20 7"></polyline>
                        <line x1="9" y1="20" x2="15" y2="20"></line>
                        <line x1="12" y1="4" x2="12" y2="20"></line>
                    </svg>
                    Font / Size
                </button>

                <button class="weblens-nav-btn ${activeTab === 'colors' ? 'active' : ''}" data-tab="colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                    </svg>
                    Colors
                </button>

                <button class="weblens-nav-btn ${activeTab === 'coming_soon' ? 'active' : ''}" data-tab="coming_soon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
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
