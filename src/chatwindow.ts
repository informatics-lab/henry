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
    }


}
