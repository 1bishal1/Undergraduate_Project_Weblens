(function () {
    // Standard color palette dictionary for accurate color name matching
    const COLOR_PALETTE = [
        { name: "Black", hex: "#000000", r: 0, g: 0, b: 0 },
        { name: "White", hex: "#FFFFFF", r: 255, g: 255, b: 255 },
        { name: "Red", hex: "#EF4444", r: 239, g: 68, b: 68 },
        { name: "Dark Red", hex: "#DC2626", r: 220, g: 38, b: 38 },
        { name: "Crimson", hex: "#B91C1C", r: 185, g: 28, b: 28 },
        { name: "Maroon", hex: "#800000", r: 128, g: 0, b: 0 },
        { name: "Green", hex: "#22C55E", r: 34, g: 197, b: 94 },
        { name: "Emerald Green", hex: "#10B981", r: 16, g: 185, b: 129 },
        { name: "Dark Green", hex: "#15803D", r: 21, g: 128, b: 61 },
        { name: "Forest Green", hex: "#166534", r: 22, g: 101, b: 52 },
        { name: "Lime Green", hex: "#84CC16", r: 132, g: 204, b: 22 },
        { name: "Mint", hex: "#6EE7B7", r: 110, g: 231, b: 183 },
        { name: "Blue", hex: "#3B82F6", r: 59, g: 130, b: 246 },
        { name: "Royal Blue", hex: "#2563EB", r: 37, g: 99, b: 235 },
        { name: "Dark Blue", hex: "#1D4ED8", r: 29, g: 78, b: 216 },
        { name: "Navy Blue", hex: "#1E3A8A", r: 30, g: 58, b: 138 },
        { name: "Sky Blue", hex: "#0EA5E9", r: 14, g: 165, b: 233 },
        { name: "Light Blue", hex: "#38BDF8", r: 56, g: 189, b: 248 },
        { name: "Cyan", hex: "#06B6D4", r: 6, g: 182, b: 212 },
        { name: "Teal", hex: "#14B8A6", r: 20, g: 184, b: 166 },
        { name: "Yellow", hex: "#EAB308", r: 234, g: 179, b: 8 },
        { name: "Gold", hex: "#FFD700", r: 255, g: 215, b: 0 },
        { name: "Amber", hex: "#F59E0B", r: 245, g: 158, b: 11 },
        { name: "Orange", hex: "#F97316", r: 249, g: 115, b: 22 },
        { name: "Dark Orange", hex: "#EA580C", r: 234, g: 88, b: 12 },
        { name: "Purple", hex: "#A855F7", r: 168, g: 85, b: 247 },
        { name: "Violet", hex: "#8B5CF6", r: 139, g: 92, b: 246 },
        { name: "Deep Purple", hex: "#7E22CE", r: 126, g: 34, b: 206 },
        { name: "Indigo", hex: "#6366F1", r: 99, g: 102, b: 241 },
        { name: "Pink", hex: "#EC4899", r: 236, g: 72, b: 153 },
        { name: "Hot Pink", hex: "#FF69B4", r: 255, g: 105, b: 180 },
        { name: "Rose", hex: "#F43F5E", r: 244, g: 63, b: 94 },
        { name: "Magenta", hex: "#FF00FF", r: 255, g: 0, b: 255 },
        { name: "Brown", hex: "#A52A2A", r: 165, g: 42, b: 42 },
        { name: "Saddle Brown", hex: "#8B4513", r: 139, g: 69, b: 19 },
        { name: "Gray", hex: "#6B7280", r: 107, g: 114, b: 128 },
        { name: "Slate Gray", hex: "#64748B", r: 100, g: 116, b: 139 },
        { name: "Dark Slate", hex: "#0F172A", r: 15, g: 23, b: 42 },
        { name: "Charcoal", hex: "#334155", r: 51, g: 65, b: 85 },
        { name: "Light Gray", hex: "#D1D5DB", r: 209, g: 213, b: 219 },
        { name: "Off-White", hex: "#F8FAFC", r: 248, g: 250, b: 252 },
        { name: "Silver", hex: "#C0C0C0", r: 192, g: 192, b: 192 },
        { name: "Turquoise", hex: "#40E0D0", r: 64, g: 224, b: 208 },
        { name: "Coral", hex: "#FF7F50", r: 255, g: 127, b: 80 },
        { name: "Olive", hex: "#808000", r: 128, g: 128, b: 0 }
    ];

    function componentToHex(c) {
        const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    let colorCanvasCtx;
    function parseAnyColor(colorStr) {
        if (!colorStr || typeof colorStr !== "string") return null;
        const trimmed = colorStr.trim();
        if (!trimmed || ["transparent", "none", "initial", "unset", "inherit"].includes(trimmed.toLowerCase())) {
            return null;
        }

        // 1. Direct Regex for rgb(r, g, b) or rgba(r, g, b, a)
        const rgbMatch = trimmed.match(/rgba?\(\s*([\d.]+)(%?)\s*[, ]\s*([\d.]+)(%?)\s*[, ]\s*([\d.]+)(%?)(?:\s*[/,]\s*([\d.]+)(%?))?\s*\)/i);
        if (rgbMatch) {
            let r = parseFloat(rgbMatch[1]);
            let g = parseFloat(rgbMatch[3]);
            let b = parseFloat(rgbMatch[5]);
            if (rgbMatch[2] === "%") r = (r / 100) * 255;
            if (rgbMatch[4] === "%") g = (g / 100) * 255;
            if (rgbMatch[6] === "%") b = (b / 100) * 255;

            let a = 1;
            if (rgbMatch[7] !== undefined) {
                a = parseFloat(rgbMatch[7]);
                if (rgbMatch[8] === "%") a = a / 100;
            }
            return { r: Math.round(r), g: Math.round(g), b: Math.round(b), a };
        }

        // 2. Direct Regex for Hex (#RGB, #RGBA, #RRGGBB, #RRGGBBAA)
        const hexMatch = trimmed.match(/^#([0-9a-f]{3,8})$/i);
        if (hexMatch) {
            let hex = hexMatch[1];
            if (hex.length === 3 || hex.length === 4) {
                hex = hex.split('').map(c => c + c).join('');
            }
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            const a = hex.length >= 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;
            return { r, g, b, a };
        }

        // 3. Canvas 2D Fallback
        if (!colorCanvasCtx) {
            const canvas = document.createElement("canvas");
            canvas.width = 1;
            canvas.height = 1;
            colorCanvasCtx = canvas.getContext("2d", { willReadFrequently: true });
        }

        try {
            colorCanvasCtx.clearRect(0, 0, 1, 1);
            colorCanvasCtx.fillStyle = "rgba(0,0,0,0)";
            colorCanvasCtx.fillStyle = trimmed;
            colorCanvasCtx.fillRect(0, 0, 1, 1);
            const data = colorCanvasCtx.getImageData(0, 0, 1, 1).data;

            if (data[3] > 0) {
                return {
                    r: data[0],
                    g: data[1],
                    b: data[2],
                    a: data[3] / 255
                };
            }
        } catch (e) {
            // Ignore canvas error
        }

        return null;
    }

    function getColorName(r, g, b) {
        let minDistance = Infinity;
        let closestName = "Unknown";

        for (const entry of COLOR_PALETTE) {
            // Weighted Euclidean distance for human color perception (3*R^2 + 4*G^2 + 2*B^2)
            const distance = 3 * Math.pow(r - entry.r, 2) + 4 * Math.pow(g - entry.g, 2) + 2 * Math.pow(b - entry.b, 2);
            if (distance < minDistance) {
                minDistance = distance;
                closestName = entry.name;
            }
        }

        return closestName;
    }

    function getElementPrimaryColor(element) {
        if (!element || !(element instanceof Element)) {
            return null;
        }

        const styles = getComputedStyle(element);
        let parsed = null;

        const tagName = element.tagName.toLowerCase();

        // 1. Check SVG element fill / stroke
        if (element instanceof SVGElement || tagName === "svg" || element.closest("svg")) {
            const svgElem = element instanceof SVGElement ? element : element.closest("svg");
            const svgStyles = getComputedStyle(svgElem);
            const fill = parseAnyColor(styles.fill !== "none" ? styles.fill : svgStyles.fill);
            const stroke = parseAnyColor(styles.stroke !== "none" ? styles.stroke : svgStyles.stroke);
            if (fill && fill.a > 0.05) parsed = fill;
            else if (stroke && stroke.a > 0.05) parsed = stroke;
        }

        // 2. Check element's own background color (e.g. Buttons, Cards, Badges, Inputs, Divs)
        if (!parsed) {
            const elementBg = parseAnyColor(styles.backgroundColor);
            if (elementBg && elementBg.a > 0.05) {
                parsed = elementBg;
            }
        }

        // 3. Text color for text-bearing tags (prefer visible glyph color at the pointer)
        const isTextTag = /^(a|p|span|h[1-6]|strong|em|b|i|label|code|small|sub|sup|li|td|th|figcaption|cite|mark|input|textarea|select|option)$/i.test(tagName);
        if (!parsed && isTextTag) {
            const textColor = parseAnyColor(styles.color);
            if (textColor && textColor.a > 0.05) {
                parsed = textColor;
            }
        }

        // 4. Button / control backgrounds (not links — link text uses step 3 above)
        if (!parsed) {
            const buttonParent = element.closest("button, [role='button'], .btn");
            if (buttonParent && buttonParent instanceof Element) {
                const buttonBg = parseAnyColor(getComputedStyle(buttonParent).backgroundColor);
                if (buttonBg && buttonBg.a > 0.05) {
                    parsed = buttonBg;
                }
            }
        }

        // 5. Border color if border width > 0
        if (!parsed) {
            const borderTopWidth = parseFloat(styles.borderTopWidth) || 0;
            if (borderTopWidth > 0) {
                const borderColor = parseAnyColor(styles.borderColor || styles.borderTopColor);
                if (borderColor && borderColor.a > 0.05) {
                    parsed = borderColor;
                }
            }
        }

        // 6. Walk up parent hierarchy for background color (transparent containers)
        if (!parsed) {
            let curr = element;
            while (curr && curr instanceof Element) {
                const parentBg = parseAnyColor(getComputedStyle(curr).backgroundColor);
                if (parentBg && parentBg.a > 0.05) {
                    parsed = parentBg;
                    break;
                }
                curr = curr.parentElement;
            }
        }

        // 7. Fallback to White (#FFFFFF) if page background is transparent
        if (!parsed) {
            parsed = { r: 255, g: 255, b: 255, a: 1 };
        }

        const hex = rgbToHex(parsed.r, parsed.g, parsed.b).toUpperCase();
        const colorName = getColorName(parsed.r, parsed.g, parsed.b);

        return {
            hex,
            colorName,
            rgb: `rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`
        };
    }

    function isWebLensUiElement(element) {
        if (!element || !(element instanceof Element)) {
            return true;
        }
        if (element.id === "weblens-inspection-pointer" || element.id === "weblens-hover-popup" || element.id === "weblens-techstack-panel") {
            return true;
        }
        if (element.id === "weblens-toolbar") {
            return true;
        }
        return !!(window.WebLensToolbar && typeof window.WebLensToolbar.contains === "function" && window.WebLensToolbar.contains(element));
    }

    function getColorAtPoint(clientX, clientY) {
        if (typeof clientX !== "number" || typeof clientY !== "number") {
            return null;
        }

        let stack;
        try {
            stack = document.elementsFromPoint(clientX, clientY);
        } catch (e) {
            return null;
        }

        if (!stack || stack.length === 0) {
            return null;
        }

        for (const el of stack) {
            if (isWebLensUiElement(el)) {
                continue;
            }
            return getElementPrimaryColor(el);
        }

        return null;
    }

    window.WebLensColorInspector = {
        getElementPrimaryColor,
        getColorAtPoint,
        rgbToHex,
        getColorName,
        parseAnyColor
    };
})();
