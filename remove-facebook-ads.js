(function (jsn) {

    const feed = document.querySelector(`[role="feed"]`);

    function isAd(el) {
        let label = el.querySelector(`[aria-labelledby]`)
        if (!label) return false;
        let spans = label.querySelectorAll("span");
        Array.from(spans).forEach(el => {
            let style = window.getComputedStyle(el);
            style.position === "absolute" && el.remove()
        })
        return label.innerText === "Sponsored";
    }

    function getAllAds() {
        // First 2 posts are:
        // --- [data-pagelet="FeedUnit_0"], [data-pagelet="FeedUnit_1"]
        // the rest are
        // --- [data-pagelet="FeedUnit_{n}"]
        return Array.from(feed.querySelectorAll(`[data-pagelet]`))
            .filter(rs => {
                let children = Array.from(rs.querySelectorAll(`[dir="auto"]`));

                return children[0][children[0].innerText.length - 2] !== "." &&
                    isAd(children[2])
            })
    }


    function removeAds(el) {
        el.style.opacity = 0;
        el.style.position = "fixed";
        el.style.pointerEvents = "none";
    }

    getAllAds().forEach(removeAds);


    const config = { attributes: true, childList: true, subtree: true };
    const callback = function (mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                getAllAds().forEach(removeAds);
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(feed, config);

    jsn.completeTask();
})