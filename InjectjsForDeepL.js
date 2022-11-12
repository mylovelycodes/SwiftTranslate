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
                console.log("wait ..." + alreadyWait)
                alreadyWait = alreadyWait + 1
            }
        }
    }, 1000)
}

function checkIfReady() {
    if (document.querySelector("main[id=\"dl_translator\"] div[class=\"lmt__textarea lmt__textarea_dummydiv\"]") !== null) {
        if (document.querySelector("div[class=\"lmt__loadingIndicator_container\"]").innerHTML == ""){
            if (document.querySelector("[dl-test='translator-source-input']") !== null) {
                if (document.querySelector("textarea[dl-test=translator-target-input]") !== null ) {
                    const text = document.querySelector("textarea[dl-test=translator-target-input]").value
                    if (text != "" && !text.includes("[...]")) {
                        return true
                    }
                }
            }
        }
    }
    return false
}

function getTranslateResult() {
    var result = {}
    const text = document.querySelector("textarea[dl-test=translator-target-input]").value
    const source_lang  =  document.querySelector("[dl-test='translator-source-input']").lang
    const l = document.querySelector("[dl-test='translator-target-lang']");
    const target_lang = l === null ? "" : l.getAttribute("dl-selected-lang")
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

