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

function getOutPutText() {
    var text = []
    const elements = document.querySelectorAll("span[jsname=\"W297wb\"]")
    if (elements.length > 0){
        for (let index = 0; index < elements.length; index += 1) {
            const element = elements[index]
            if (element.textContent !== "" && element.textContent !== "\n\n") {
                text.push(element.textContent)
            }
            console.log(element)
        }
    }
    console.log(text)
    text = text.join("\n")
    return text
}

function checkIfReady() {
    if (document.querySelector("div[aria-live=\"polite\"]") !== null) {
        const text = getOutPutText()
        if (text !== "") {
            return true
        }
    }
    return false
}

function getTranslateResult() {
    var result = {}
    const text = getOutPutText()
    const source_lang  =  document.querySelector("span[jsname=\"ZdXDJ\"]").lang
    const target_lang = document.querySelector("span[jsname=\"jqKxS\"]").lang
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

