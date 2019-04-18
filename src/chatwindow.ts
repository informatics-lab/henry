import { Widget } from "@phosphor/widgets";
import { NotebookPanel } from "@jupyterlab/notebook";

export function createChatWindow(nbPanel: NotebookPanel) {

    return new ChatWindow('the title', nbPanel)
}



export class ChatWindow extends Widget {

    constructor(title: string, nbPanel: NotebookPanel) {
        super();
        this.id = `henry-widow-${nbPanel.id}`
        this.addClass('henry-chat-window');
        this.title.label = title;
        this.title.closable = true;
        console.log(nbPanel)
    }


}
