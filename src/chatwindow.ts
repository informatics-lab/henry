// $UID$ will later be replaced with a unique id so that 
// when there is more than one chat window we can uniquely address each one.

const CHAT_WINDOW_HTML = `
<div class="henryWindow>
    <div id="reply-$UID$" class="henry-reply" ></div>
    <div>
        <input type="text" id="input-$UID$"/>
        <button value="go" id="submit-$UID$">Go!</button>
    </div>
</div>
`
function uid() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
}

export function createChatWindow() {
    let div = document.createElement('div');
    let id = uid();
    div.className = 'henryWindow';
    div.innerHTML = CHAT_WINDOW_HTML.replace("$UID$", id)
    console.log('hi');
    return div;
}