(function () {
    const NAVBAR_ID = "weblens-toolbar";
    let toolbarElement;
    let activeTab = "font"; // 'font' | 'colors' | 'coming_soon'


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
        ;

    };
};
