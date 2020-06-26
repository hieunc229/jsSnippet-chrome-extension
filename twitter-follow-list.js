(function (jsn) {
    jsn.onEventEmit(function(event) {
        switch (event.action) {
            case "stop":
                processPaused = true;
                jsn.completeTask();
                break;
        }
    });

    function updateLabel(...rest) {
        jsn.setLabelinnerHTML(`<span>${rest.join(" ")}</span><button data-action="stop">Stop</button>`);
    }

    var list, total = 0, leftOver = 10;

    const stopAfter = 10;
    const processSleep = 3000;
    const breakSleep = 10000;

    function getList() {
        list = Array.from(document.querySelectorAll(`[aria-labelledby*="accessible-list"] [data-testid="UserCell"]`))
            .filter(item => item.textContent.indexOf("Follows you") === -1);
        total += list.length;
        if (list.length) {
            processRequest(0)
        } else {
            updateLabel(`No more users to follow. You can stop now`);
        }
    }

    function processRequest(i) {
        if (list.length > i) {

            if (leftOver === 0) {
                leftOver = stopAfter;
                updateLabel("Take a break:", i);
                setTimeout(() => {
                    processRequest(i);
                }, breakSleep);
                return;
            }

            leftOver--;

            updateLabel("Following", total - list.length + i + 1, "/", total);

            let actionButton = list[i].querySelector(`[data-testid*="-follow"]`);
            if (actionButton) {
                actionButton.click();
                actionButton.scrollIntoView();
            }
            // Next request
            setTimeout(() => {
                processRequest(i + 1);
            }, processSleep)

        } else {
            getList();
        }
    }

    getList();
})