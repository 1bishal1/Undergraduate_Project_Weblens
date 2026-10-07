(function () {
    const POPUP_ID = "weblens-hover-popup";
    let popupElement;

    // Canvas font rendering detection
    let canvasContext;
    const TEST_TEXT = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const TEST_SIZE = "72px";
    const BASE_FONTS = ["monospace", "sans-serif", "serif"];
    let baseWidths = null;

    function getCanvasContext() {
        if (!canvasContext) {
            const canvas = document.createElement("canvas");
            canvasContext = canvas.getContext("2d");
        }
        return canvasContext;
    }

    function measureTextWidth(text, fontSpec) {
        try {
            const ctx = getCanvasContext();
            if (!ctx) return 0;
            ctx.font = fontSpec;
            return ctx.measureText(text).width;
        } catch (e) {
            return 0;
        }
    }

    function initBaseWidths() {
        if (!baseWidths) {
            baseWidths = {};
            for (const baseFont of BASE_FONTS) {
                baseWidths[baseFont] = measureTextWidth(TEST_TEXT, `${TEST_SIZE} ${baseFont}`);
            }
        }
    }

    function isFontRenderedOnCanvas(fontName) {
        if (!fontName) return false;
        const lower = fontName.toLowerCase();

        // Generic font families are always valid render targets
        if (["sans-serif", "serif", "monospace", "cursive", "fantasy", "system-ui"].includes(lower)) {
            return true;
        }

        initBaseWidths();

        // Compare text width of candidate font against base fallbacks
        for (const baseFont of BASE_FONTS) {
            const testWidth = measureTextWidth(TEST_TEXT, `${TEST_SIZE} "${fontName}", ${baseFont}`);
            if (testWidth !== baseWidths[baseFont] && testWidth > 0) {
                return true; // Candidate font is active and rendered by browser
            }
        }

        return false;
    }

    function formatFontName(fontName) {
        if (!fontName) return "Unknown";

        // Clean internal web font loader prefixes & suffixes (e.g. "gf_Roboto variant1" -> "Roboto")
        let cleaned = fontName
            .replace(/^gf_/i, "")
            .replace(/\s*variant\d*$/i, "")
            .replace(/^__+/g, "")
            .trim();

        if (!cleaned) cleaned = fontName;

        const lower = cleaned.toLowerCase();

        if (lower === "sans-serif") return "Sans-serif";
        if (lower === "serif") return "Serif";
        if (lower === "monospace") return "Monospace";
        if (lower === "cursive") return "Cursive";
        if (lower === "fantasy") return "Fantasy";
        if (lower === "system-ui") return "System-UI";
        if (lower === "-apple-system" || lower === "blinkmacsystemfont") return "System";

        return cleaned;
    }

    function getExactFont(fontFamilyStr) {
        if (!fontFamilyStr || typeof fontFamilyStr !== "string") {
            return "Unknown";
        }

        const trimmed = fontFamilyStr.trim();
        if (!trimmed || ["inherit", "initial", "unset", "none"].includes(trimmed.toLowerCase())) {
            return "Unknown";
        }

        // Split font stack by commas (stripping quotes & whitespace)
        const fonts = trimmed
            .split(",")
            .map((f) => f.trim().replace(/^["']|["']$/g, ""))
            .filter((f) => f.length > 0);

        if (fonts.length === 0) {
            return "Unknown";
        }

        // Test each font in the declared stack to find which one is actually rendered
        for (const font of fonts) {
            if (isFontRenderedOnCanvas(font)) {
                return formatFontName(font);
            }
        }

        // Fallback to first primary font entry
        return formatFontName(fonts[0]);
    }

    function getExactFontSize(fontSizeStr) {
        if (!fontSizeStr || typeof fontSizeStr !== "string") {
            return "Unknown";
        }

        const trimmed = fontSizeStr.trim();
        if (!trimmed || trimmed === "0px" || ["inherit", "initial", "unset"].includes(trimmed.toLowerCase())) {
            return "Unknown";
        }

        return trimmed;
    }

    function hasTextContent(element) {
        if (!element || !(element instanceof Element)) {
            return false;
        }

        // SVG graphic elements (path, rect, circle, g, etc.) don't contain renderable text
        if (element instanceof SVGElement) {
            const tag = element.tagName.toLowerCase();
            if (tag !== "text" && tag !== "tspan") {
                return false;
            }
        }

        // Check for non-whitespace text content
        const text = element.textContent ? element.textContent.trim() : "";
        return text.length > 0;
    }

    let currentInspectedElement = null;
    let lastMouseEvent = null;

    function show(element, event) {
        if (!element || !(element instanceof Element)) {
            return;
        }

        currentInspectedElement = element;
        if (event) lastMouseEvent = event;

        if (!popupElement) {
            popupElement = document.createElement("div");
            popupElement.id = POPUP_ID;
            Object.assign(popupElement.style, {
                position: "fixed",
                maxWidth: "320px",
                padding: "8px 12px",
                borderRadius: "6px",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                font: "12px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                pointerEvents: "none",
                zIndex: "2147483647",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
            });
            document.documentElement.appendChild(popupElement);
        }

        const tagName = element.tagName ? element.tagName.toLowerCase() : "Unknown";

        const activeTab = (window.WebLensState && window.WebLensState.activeTab) ||
            (window.WebLensToolbar && typeof window.WebLensToolbar.getActiveTab === "function"
                ? window.WebLensToolbar.getActiveTab()
                : "font");

        if (activeTab === "colors") {
            let colorInfo = null;
            if (window.WebLensColorInspector) {
                if (lastMouseEvent) {
                    colorInfo = window.WebLensColorInspector.getColorAtPoint(
                        lastMouseEvent.clientX,
                        lastMouseEvent.clientY
                    );
                }
                if (!colorInfo) {
                    colorInfo = window.WebLensColorInspector.getElementPrimaryColor(element);
                }
            }
            if (colorInfo && colorInfo.hex) {
                const colorName = colorInfo.colorName || "Unknown";
                popupElement.textContent = `${tagName} | ${colorInfo.hex} | ${colorName}`;
            } else {
                popupElement.textContent = `${tagName} | #000000 | Unknown`;
            }
        } else if (activeTab === "tech_stack") {
            const message = window.WebLensTechStack
                ? window.WebLensTechStack.getTechStackMessage()
                : "techstack for the web is loading ... wait a moment";
            popupElement.textContent = `${tagName} | ${message}`;
        } else {
            if (!hasTextContent(element)) {
                popupElement.textContent = `${tagName} | Empty (...)`;
            } else {
                const styles = getComputedStyle(element);
                const fontName = getExactFont(styles.fontFamily);
                const fontSize = getExactFontSize(styles.fontSize);
                popupElement.textContent = `${tagName} | ${fontName} | ${fontSize}`;
            }
        }

        if (lastMouseEvent) {
            popupElement.style.left = `${Math.min(lastMouseEvent.clientX + 12, window.innerWidth - 330)}px`;
            popupElement.style.top = `${Math.min(lastMouseEvent.clientY + 12, window.innerHeight - 60)}px`;
        }
        popupElement.hidden = false;
    }

    function refresh() {
        if (currentInspectedElement) {
            show(currentInspectedElement, lastMouseEvent);
        }
    }

    function hide() {
        if (popupElement) {
            popupElement.hidden = true;
        }
    }

    function remove() {
        popupElement?.remove();
        popupElement = undefined;
        currentInspectedElement = null;
        lastMouseEvent = null;
    }

    window.WebLensHoverPopup = { show, hide, remove, refresh };
})();