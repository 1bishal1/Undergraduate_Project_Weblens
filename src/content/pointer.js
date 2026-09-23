(function () {
    const POINTER_ID = "weblens-inspection-pointer";
    let pointerElement;
    let moveHandler;

    function activate() {
        if (pointerElement) {
            return;
        }

        pointerElement = document.createElement("div");
        pointerElement.id = POINTER_ID;
        pointerElement.setAttribute("aria-hidden", "true");
        Object.assign(pointerElement.style, {
            position: "fixed",
            width: "14px",
            height: "14px",
            border: "2px solid #2563eb",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.2)",
            pointerEvents: "none",
            transform: "translate(-50%, -50%)",
            zIndex: "2147483647",
        });

        document.documentElement.appendChild(pointerElement);
        document.documentElement.style.cursor = "crosshair";
        moveHandler = (event) => {
            pointerElement.style.left = `${event.clientX}px`;
            pointerElement.style.top = `${event.clientY}px`;
        };
        document.addEventListener("mousemove", moveHandler, true);
    }

    function deactivate() {
        document.documentElement.style.cursor = "";
        document.removeEventListener("mousemove", moveHandler, true);
        pointerElement?.remove();
        pointerElement = undefined;
        moveHandler = undefined;
    }

    window.WebLensPointer = { activate, deactivate };
})();