/*exported waitForCondition*/

function waitForCondition(condition, timeout, rejectReason) {
    timeout = timeout || 5000; // 5 secs by default
    rejectReason = "waited for " + timeout + "ms " +
                   "until " + (rejectReason || "something to happen");

    return new Promise(function (resolve, reject) {
        var result = condition(),
            timerId,
            pollId;

        if (result) {
            resolve(result);
        } else {
            timerId = setTimeout(function () {
                clearInterval(pollId);
                reject(Error(rejectReason));
            }, timeout);

            pollId = setInterval(function () {
                var result = condition();

                if (result) {
                    clearTimeout(timerId);
                    clearInterval(pollId);
                    resolve(result);
                }
            }, 10);
        }
    });
}
