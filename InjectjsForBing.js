// call when page loaded
function  waitForTranslateResult(waitSeconds = 15) {
    var alreadyWait = 0
    var timerId = setInterval(() => {
        if (checkIfReady()) {
            // ok, get and upload message
            const result = getTranslateResult()
            uploadTranslateResult("ok", "get message success", result)
            clearInterval(timerId)

        } else {
            // wait for 1 seconds and check again
            if (alreadyWait >= waitSeconds){
                // get falied
                uploadTranslateResult("falied", "not ready for 15 seconds", null)
                clearInterval(timerId)
            } else {
                alreadyWait = alreadyWait + 1
            }
        }
    }, 1000)
}

function checkIfReady() {
    if (document.querySelector("textarea[id=\"tta_output_ta\"]") !== null) {
        const text = document.querySelector("textarea[id=\"tta_output_ta\"]").value
        if (text != "" && !text.includes("[...]")) {
            return true
        }
    }
    return false
}

function getTranslateResult() {
    var result = {}
    const text = document.querySelector("textarea[id=\"tta_output_ta\"]").value
    const source_lang  =  document.querySelector("textarea[id=\"tta_input_ta\"]").lang
    const target_lang = document.querySelector("textarea[id=\"tta_output_ta\"]").lang
    return {text: text, source_lang: source_lang, target_lang: target_lang}
}

function uploadTranslateResult(status, message, data) {
    const playload = JSON.stringify({
        status: status,
        message: message,
        data: data
    })
    window.webkit.messageHandlers.translate.postMessage(playload)
}

