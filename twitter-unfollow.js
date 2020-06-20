(function (opts) {

    const list = Array.from(document.querySelectorAll(`[data-testid="UserCell"]`))
        .filter(item => item.textContent.indexOf("Follows you") === -1);

    const stopAfter = 10;
    const processSleep = 3000;
    const breakSleep = 10000;

    var processPaused = false;
    var leftOver = stopAfter;

    function listenToEvents(event) {
        switch (event.action) {
            case "stop":
                processPaused = true;
                break;
        }
    }

    opts.setLabelinnerHTML(`<span>Hello</span><button data-action="stop">Stop</button>`);
    opts.onEventEmit(listenToEvents);

    function updateLabel(...rest) {
        opts.setLabelinnerHTML(`<span>${rest.join(" ")}</span><button data-action="stop">Stop</button>`);
    }


    updateLabel("Total", list.length, "/", "items")

    function proccessAccept() {
        const confirmBtn = document.querySelector(`[data-testid="confirmationSheetConfirm"]`);
        confirmBtn && confirmBtn.click();
    }

    function processRequest(i) {
        if (list.length > i && !processPaused) {

            if (leftOver === 0) {
                leftOver = stopAfter;
                updateLabel("Take a break:", i);
                setTimeout(() => {
                    processRequest(i);
                }, breakSleep);
                return;
            }

            leftOver--;

            updateLabel("Unfollowed", i + 1, "/", list.length);

            let actionButton = list[i].querySelector(`[data-testid*="-unfollow"]`);
            actionButton && actionButton.click();

            // Confirm unfollow
            setTimeout(() => {
                proccessAccept();
            }, 500);

            // Next request
            setTimeout(() => {
                processRequest(i + 1);
            }, processSleep)

        } else {
            opts.completeTask();
        }
    }

    processRequest(0);
})