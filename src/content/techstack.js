(function () {
    const PANEL_ID = "weblens-techstack-panel";
    const STYLE_ID = "weblens-techstack-styles";
    const MODE_CLASS = "weblens-techstack-mode";

    const TECH_ICONS = {
        HTML: "html.png",
        CSS: "css.png",
        JavaScript: "js.png"
    };

    let panelElement;

    function getTechIconUrl(name) {
        const fileName = TECH_ICONS[name];
        if (!fileName) {
            return null;
        }
        return chrome.runtime.getURL("src/utils/images/" + fileName);
    }

    function pageBlob() {
        const parts = [];

        document.querySelectorAll("script[src], link[href]").forEach((el) => {
            parts.push(el.getAttribute("src") || el.getAttribute("href") || "");
        });

        document.querySelectorAll("meta[name], meta[property], meta[content]").forEach((el) => {
            parts.push(el.getAttribute("name") || "");
            parts.push(el.getAttribute("property") || "");
            parts.push(el.getAttribute("content") || "");
        });

        Array.from(document.scripts).forEach((script) => {
            if (!script.src && script.textContent) {
                parts.push(script.textContent.slice(0, 4000));
            }
        });

        parts.push(document.documentElement.innerHTML.slice(0, 20000));
        return parts.join(" ").toLowerCase();
    }

    function hasSelector(selector) {
        try {
            return !!document.querySelector(selector);
        } catch (e) {
            return false;
        }
    }

    function getPageHints() {
        const hints = {};
        try {
            const script = document.createElement("script");
            script.textContent = `(function () {
                var keys = ["React", "Vue", "ng", "jQuery", "Shopify", "gtag", "ga", "dataLayer", "firebase", "Stripe", "Alpine", "htmx", "__NEXT_DATA__", "__NUXT__", "webpackChunk"];
                var found = [];
                keys.forEach(function (key) {
                    try {
                        if (typeof window[key] !== "undefined") found.push(key);
                    } catch (e) {}
                });
                document.documentElement.setAttribute("data-weblens-tech", found.join(","));
            })();`;
            (document.head || document.documentElement).appendChild(script);
            script.remove();
            const raw = document.documentElement.getAttribute("data-weblens-tech") || "";
            document.documentElement.removeAttribute("data-weblens-tech");
            raw.split(",").forEach((key) => {
                if (key) hints[key] = true;
            });
        } catch (e) {
            // Page CSP may block the probe; DOM checks below still run.
        }
        return hints;
    }

    function detectTechStack() {
        const blob = pageBlob();
        const hints = getPageHints();
        const found = {
            Languages: [],
            Frontend: [],
            Backend: [],
            Styling: [],
            "CMS / Platform": [],
            "API / Services": [],
            "Build / Tooling": [],
            Analytics: []
        };

        function add(group, name) {
            if (!found[group].includes(name)) {
                found[group].push(name);
            }
        }

        if (document.documentElement) add("Languages", "HTML");
        if (document.querySelector("link[rel='stylesheet'], style") || /\.css(\?|$)/.test(blob)) {
            add("Languages", "CSS");
        }
        if (document.scripts.length > 0 || hints.jQuery || blob.includes(".js")) {
            add("Languages", "JavaScript");
        }

        const checks = [
            { group: "Frontend", name: "React", match: () => hints.React || hasSelector("[data-reactroot], [data-reactid], #__next") || blob.includes("react") },
            { group: "Frontend", name: "Next.js", match: () => hints.__NEXT_DATA__ || hasSelector("#__NEXT_DATA__, #__next") || blob.includes("/_next/") },
            { group: "Frontend", name: "Vue.js", match: () => hints.Vue || hasSelector("[data-v-]") || blob.includes("vue") },
            { group: "Frontend", name: "Nuxt.js", match: () => hints.__NUXT__ || hasSelector("#__nuxt, #__NUXT_DATA__") || blob.includes("/_nuxt/") },
            { group: "Frontend", name: "Angular", match: () => hints.ng || hasSelector("[ng-version]") || blob.includes("ng-version") || /angular(\.js|\/)/.test(blob) },
            { group: "Frontend", name: "Svelte", match: () => blob.includes("svelte") },
            { group: "Frontend", name: "jQuery", match: () => hints.jQuery || blob.includes("jquery") },
            { group: "Frontend", name: "Alpine.js", match: () => hints.Alpine || hasSelector("[x-data]") },
            { group: "Frontend", name: "Gatsby", match: () => hasSelector("#___gatsby") || blob.includes("gatsby") },
            { group: "Frontend", name: "Remix", match: () => blob.includes("remix") && blob.includes("__remix") },
            { group: "Frontend", name: "Astro", match: () => blob.includes("astro") && hasSelector("astro-island, [data-astro-cid]") },
            { group: "Frontend", name: "HTMX", match: () => hints.htmx || blob.includes("htmx") },

            { group: "Backend", name: "Node.js", match: () => hints.__NEXT_DATA__ || blob.includes("/_next/") || blob.includes("/_nuxt/") || blob.includes("express") },
            { group: "Backend", name: "PHP", match: () => blob.includes(".php") || blob.includes("wp-content") || blob.includes("laravel") || blob.includes("x-powered-by: php") },
            { group: "Backend", name: "Python / Django", match: () => hasSelector("[name='csrfmiddlewaretoken']") || blob.includes("django") || blob.includes("csrfmiddlewaretoken") },
            { group: "Backend", name: "Ruby on Rails", match: () => blob.includes("rails") || hasSelector("meta[name='csrf-token']") && blob.includes("turbolinks") },
            { group: "Backend", name: "ASP.NET", match: () => hasSelector("[name='__VIEWSTATE']") || blob.includes("aspnet") || blob.includes(".aspx") },
            { group: "Backend", name: "Java", match: () => blob.includes(".jsp") || blob.includes("jsessionid") || blob.includes("struts") },

            { group: "Styling", name: "Tailwind CSS", match: () => blob.includes("tailwind") },
            { group: "Styling", name: "Bootstrap", match: () => blob.includes("bootstrap") || hasSelector(".container, .row, .col-md-6, [class*='col-']") && blob.includes("bootstrap") },
            { group: "Styling", name: "Material UI", match: () => blob.includes("mui") || blob.includes("material-ui") || hasSelector("[class*='MuiButton']") },
            { group: "Styling", name: "Font Awesome", match: () => blob.includes("font-awesome") || blob.includes("fontawesome") || hasSelector(".fa, .fas, .far") },
            { group: "Styling", name: "Google Fonts", match: () => blob.includes("fonts.googleapis.com") || blob.includes("fonts.gstatic.com") },

            { group: "CMS / Platform", name: "WordPress", match: () => blob.includes("wp-content") || blob.includes("wp-includes") || blob.includes("wordpress") },
            { group: "CMS / Platform", name: "Shopify", match: () => hints.Shopify || blob.includes("cdn.shopify") || blob.includes("shopify") },
            { group: "CMS / Platform", name: "Wix", match: () => blob.includes("wix.com") || blob.includes("wixstatic") },
            { group: "CMS / Platform", name: "Squarespace", match: () => blob.includes("squarespace") },
            { group: "CMS / Platform", name: "Webflow", match: () => blob.includes("webflow") },
            { group: "CMS / Platform", name: "Drupal", match: () => blob.includes("drupal") || blob.includes("sites/default/files") },
            { group: "CMS / Platform", name: "Joomla", match: () => blob.includes("joomla") },
            { group: "CMS / Platform", name: "Magento", match: () => blob.includes("magento") || blob.includes("mage/") },

            { group: "API / Services", name: "GraphQL", match: () => blob.includes("graphql") },
            { group: "API / Services", name: "REST", match: () => blob.includes("/api/") || blob.includes("application/json") },
            { group: "API / Services", name: "Firebase", match: () => hints.firebase || blob.includes("firebase") },
            { group: "API / Services", name: "Supabase", match: () => blob.includes("supabase") },
            { group: "API / Services", name: "Stripe", match: () => hints.Stripe || blob.includes("js.stripe.com") || blob.includes("stripe") },
            { group: "API / Services", name: "Google Maps", match: () => blob.includes("maps.googleapis.com") },
            { group: "API / Services", name: "Cloudflare", match: () => blob.includes("cloudflare") || blob.includes("cf-") },

            { group: "Build / Tooling", name: "Webpack", match: () => hints.webpackChunk || blob.includes("webpack") },
            { group: "Build / Tooling", name: "Vite", match: () => blob.includes("vite") || blob.includes("/@vite/") },
            { group: "Build / Tooling", name: "Parcel", match: () => blob.includes("parcel") },

            { group: "Analytics", name: "Google Analytics", match: () => hints.gtag || hints.ga || blob.includes("google-analytics") || blob.includes("gtag(") },
            { group: "Analytics", name: "Google Tag Manager", match: () => hints.dataLayer || blob.includes("googletagmanager.com") }
        ];

        for (const rule of checks) {
            try {
                if (rule.match()) add(rule.group, rule.name);
            } catch (e) {
                // skip a single failed check
            }
        }

        if (found.Frontend.includes("Next.js") || found.Frontend.includes("Nuxt.js") || found.Frontend.includes("Gatsby")) {
            add("Backend", "Node.js");
        }
        if (found["CMS / Platform"].includes("WordPress")) {
            add("Backend", "PHP");
        }

        const groups = {};
        let total = 0;
        for (const [group, items] of Object.entries(found)) {
            if (items.length > 0) {
                groups[group] = items;
                total += items.length;
            }
        }

        return { groups, total };
    }

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
            html.${MODE_CLASS},
            html.${MODE_CLASS} * {
                cursor: none !important;
            }

            html.${MODE_CLASS} #weblens-toolbar,
            html.${MODE_CLASS} #weblens-toolbar *,
            html.${MODE_CLASS} #${PANEL_ID},
            html.${MODE_CLASS} #${PANEL_ID} * {
                cursor: pointer !important;
            }

            #${PANEL_ID} {
                position: fixed !important;
                top: 88px !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                z-index: 2147483646 !important;
                width: min(520px, calc(100vw - 32px)) !important;
                max-height: min(70vh, 560px) !important;
                overflow: auto !important;
                background: #000000 !important;
                color: #ffffff !important;
                border-radius: 16px !important;
                box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5) !important;
                padding: 16px 18px !important;
                font: 13px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            }

            #${PANEL_ID} .weblens-tech-title {
                font-size: 15px !important;
                font-weight: 700 !important;
                margin-bottom: 12px !important;
            }

            #${PANEL_ID} .weblens-tech-group {
                margin-bottom: 12px !important;
            }

            #${PANEL_ID} .weblens-tech-group-name {
                color: #a3a3a3 !important;
                font-size: 11px !important;
                font-weight: 600 !important;
                letter-spacing: 0.04em !important;
                text-transform: uppercase !important;
                margin-bottom: 6px !important;
            }

            #${PANEL_ID} .weblens-tech-pills {
                display: flex !important;
                flex-wrap: wrap !important;
                gap: 6px !important;
            }

            #${PANEL_ID} .weblens-tech-pill {
                background: #ffffff !important;
                color: #000000 !important;
                border-radius: 9999px !important;
                padding: 5px 10px !important;
                font-weight: 600 !important;
                font-size: 12px !important;
                display: inline-flex !important;
                align-items: center !important;
                gap: 6px !important;
            }

            #${PANEL_ID} .weblens-tech-pill img {
                width: 16px !important;
                height: 16px !important;
                object-fit: contain !important;
                display: block !important;
            }

            #${PANEL_ID} .weblens-tech-empty {
                color: #a3a3a3 !important;
            }
        `;
        document.head.appendChild(style);
    }

    function renderPanel(result) {
        panelElement.replaceChildren();

        const title = document.createElement("div");
        title.className = "weblens-tech-title";
        title.textContent = "Tech stack";
        panelElement.appendChild(title);

        if (!result || result.total === 0) {
            const empty = document.createElement("div");
            empty.className = "weblens-tech-empty";
            empty.textContent = "could not extract";
            panelElement.appendChild(empty);
            return;
        }

        for (const [group, items] of Object.entries(result.groups)) {
            const section = document.createElement("div");
            section.className = "weblens-tech-group";

            const heading = document.createElement("div");
            heading.className = "weblens-tech-group-name";
            heading.textContent = group;
            section.appendChild(heading);

            const pills = document.createElement("div");
            pills.className = "weblens-tech-pills";
            items.forEach((item) => {
                const pill = document.createElement("span");
                pill.className = "weblens-tech-pill";

                const iconUrl = getTechIconUrl(item);
                if (iconUrl) {
                    const img = document.createElement("img");
                    img.src = iconUrl;
                    img.alt = item;
                    pill.appendChild(img);
                }

                const label = document.createElement("span");
                label.textContent = item;
                pill.appendChild(label);
                pills.appendChild(pill);
            });
            section.appendChild(pills);
            panelElement.appendChild(section);
        }
    }

    function show() {
        injectStyles();
        document.documentElement.classList.add(MODE_CLASS);

        if (window.WebLensPointer && typeof window.WebLensPointer.hide === "function") {
            window.WebLensPointer.hide();
        }
        if (window.WebLensHoverPopup && typeof window.WebLensHoverPopup.hide === "function") {
            window.WebLensHoverPopup.hide();
        }

        if (!panelElement) {
            panelElement = document.createElement("div");
            panelElement.id = PANEL_ID;
            (document.body || document.documentElement).appendChild(panelElement);
        }

        panelElement.hidden = false;
        renderPanel(detectTechStack());
    }

    function hide() {
        document.documentElement.classList.remove(MODE_CLASS);
        if (panelElement) {
            panelElement.hidden = true;
        }
        if (window.WebLensPointer && typeof window.WebLensPointer.show === "function") {
            window.WebLensPointer.show();
        }
    }

    function remove() {
        hide();
        panelElement?.remove();
        panelElement = undefined;
        document.getElementById(STYLE_ID)?.remove();
    }

    function contains(element) {
        return panelElement ? panelElement.contains(element) : false;
    }

    window.WebLensTechStack = {
        show,
        hide,
        remove,
        contains,
        detectTechStack
    };
})();
