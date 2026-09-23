(function () {
    const POPUP_ID = "weblens-hover-popup";
    let popupElement;

    function show(element, event) {
        if (!popupElement) {
            popupElement = document.createElement("div");
            popupElement.id = POPUP_ID;
            Object.assign(popupElement.style, {
                position: "fixed",
                maxWidth: "260px",
                padding: "8px 10px",
                borderRadius: "6px",
                backgroundColor: "#111827",
                color: "#ffffff",
                font: "12px/1.4 Arial, sans-serif",
                pointerEvents: "none",
                zIndex: "2147483647",
            });
            document.documentElement.appendChild(popupElement);
        }

        const styles = getComputedStyle(element);
        popupElement.textContent = `${element.tagName.toLowerCase()} | ${styles.fontFamily} | ${styles.fontSize}`;
        popupElement.style.left = `${Math.min(event.clientX + 12, window.innerWidth - 280)}px`;
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