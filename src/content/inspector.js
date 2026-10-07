(function () {
    let inspectionActive = false;
    let currentElement;

    function isWebLensUiTarget(element) {
        if (!element || !(element instanceof Element)) {
            return true;
        }
        if (element.id === "weblens-inspection-pointer" || element.id === "weblens-hover-popup") {
            return true;
        }
        return !!(window.WebLensToolbar && window.WebLensToolbar.contains(element));
    }

    function resolveElementAtPointer(event) {
        if (event.target instanceof Element && !isWebLensUiTarget(event.target)) {
            return event.target;
        }

        let stack;
        try {
            stack = document.elementsFromPoint(event.clientX, event.clientY);
        } catch (e) {
            return null;
        }

        if (!stack) {
            return null;
        }

        for (const el of stack) {
            if (el instanceof Element && !isWebLensUiTarget(el)) {
                return el;
            }
        }

        return null;
    }

    function inspect(event) {
        const element = resolveElementAtPointer(event);

        if (!element) {
            return;
        }

        currentElement = element;
        window.WebLensHoverPopup.show(element, event);
    }

    function clearSelection() {
        currentElement = undefined;
        window.WebLensHoverPopup.hide();
    }
    
    function start() {
        if (inspectionActive) {
            return;
        }

        inspectionActive = true;
        window.WebLensPointer.activate();
        window.WebLensToolbar.show();
        document.addEventListener("mousemove", inspect, true);
    }

    function stop() {
        if (!inspectionActive) {
            return;
        }

        inspectionActive = false;
        document.removeEventListener("mousemove", inspect, true);
        clearSelection();
        window.WebLensPointer.deactivate();
        window.WebLensHoverPopup.remove();
        window.WebLensToolbar.hide();
    }

    window.WebLensInspector = { start, stop };

})();