(function () {
    const POPUP_ID = "weblens-hover-popup";
    let popupElement;

    function getExactFont(fontFamilyStr) {
        if (!fontFamilyStr || typeof fontFamilyStr !== "string") {
            return "Unknown";
        }

        const trimmed = fontFamilyStr.trim();
        if (!trimmed || ["inherit", "initial", "unset", "none"].includes(trimmed.toLowerCase())) {
            return "Unknown";
        }

        // Split font stack by commas (stripping surrounding quotes and whitespace)
        const fonts = trimmed
            .split(",")
            .map((f) => f.trim().replace(/^["']|["']$/g, ""))
            .filter((f) => f.length > 0);

        if (fonts.length === 0) {
            return "Unknown";
        }

        // Try checking which specific font is loaded & active in document
        if (document.fonts && typeof document.fonts.check === "function") {
            for (const font of fonts) {
                const lower = font.toLowerCase();
                if (["sans-serif", "serif", "monospace", "cursive", "fantasy", "system-ui"].includes(lower)) {
                    continue;
                }
                try {
                    if (document.fonts.check(`16px "${font}"`)) {
                        return font;
                    }
                } catch (e) {
                    // Ignore check error and continue loop
                }
            }
        }

        // Fallback: return the first primary (non-generic) font declared
        for (const font of fonts) {
            const lower = font.toLowerCase();
            if (!["sans-serif", "serif", "monospace", "cursive", "fantasy", "system-ui", "initial", "inherit"].includes(lower)) {
                return font;
            }
        }

        // Return first entry if only generic font keyword was supplied
        const firstFont = fonts[0];
        if (firstFont) {
            return firstFont;
        }

        return "Unknown";
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

    function show(element, event) {
        if (!element || !(element instanceof Element)) {
            return;
        }

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

        const styles = getComputedStyle(element);
        const tagName = element.tagName ? element.tagName.toLowerCase() : "Unknown";
        const fontName = getExactFont(styles.fontFamily);
        const fontSize = getExactFontSize(styles.fontSize);

        popupElement.textContent = `${tagName} | ${fontName} | ${fontSize}`;
        popupElement.style.left = `${Math.min(event.clientX + 12, window.innerWidth - 330)}px`;
        popupElement.style.top = `${Math.min(event.clientY + 12, window.innerHeight - 60)}px`;
        popupElement.hidden = false;
    }

    function hide() {
        if (popupElement) {
            popupElement.hidden = true;
        }
    }

    function remove() {
        popupElement?.remove();
        popupElement = undefined;
    }

    window.WebLensHoverPopup = { show, hide, remove };
})();