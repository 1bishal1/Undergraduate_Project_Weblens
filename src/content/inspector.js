(function () {
    let inspectionActive = false;
    let currentElement;

    function inspect(event) {
        const element = event.target;

        if (!(element instanceof Element) || element.id === "weblens-inspection-pointer" || element.id === "weblens-hover-popup") {
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
    }

    window.WebLensInspector = { start, stop };

})();