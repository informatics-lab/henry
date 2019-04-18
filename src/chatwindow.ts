import { Widget } from "@phosphor/widgets";
import { NotebookPanel } from "@jupyterlab/notebook";

export function createChatWindow(nbPanel: NotebookPanel) {


    nbPanel.activated.connect((nb, args) => {
        console.log(nbPanel.content.title.label)
    })

    return new ChatWindow('Henry for: ' + nbPanel.content.title.label, nbPanel)


}



export class ChatWindow extends Widget {

    constructor(title: string, nbPanel: NotebookPanel) {
        super();
        this.id = `henry-widow-${nbPanel.id}`
        this.addClass('henry-chat-window');
        this.title.label = title;
        this.title.closable = true;
        console.log(nbPanel)
        this.node.innerHTML = `<h1>${title}</h1>`
        let btn = document.createElement('button')
        btn.addEventListener('click', (ev: MouseEvent) => { alert('hi') })
        btn.innerText = "click me"
        btn.className = 'the-buttn'

        // btn.onclick =
        //     (ev: MouseEvent) => { alert('hi') }

        this.node.appendChild(btn)


    }


}
