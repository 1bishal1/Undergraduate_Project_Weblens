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

})();