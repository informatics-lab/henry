import { Widget, TabPanel } from "@phosphor/widgets";
import { NotebookPanel } from "@jupyterlab/notebook";
import { UUID } from "@phosphor/coreutils";
import { ISignal, Signal } from "@phosphor/signaling";

export class ChatWindowCollection {

    public readonly tabPanel: TabPanel

    constructor() {
        this.tabPanel = new TabPanel()
        this.tabPanel.title.label = "Henry"
        this.tabPanel.id = UUID.uuid4()
    }

    private setTitle(nbPanel: NotebookPanel) {
        if (nbPanel) {
            this.tabPanel.title.label = `Henry (${nbPanel.title.label})`
            this.tabPanel.title.iconClass = "fa fa-user"
        } else {
            this.tabPanel.title.label = "No Henry Here."
            this.tabPanel.title.iconClass = "fa fa-frown-o"
        }
    }

    private getChatWindow(nbPanel: NotebookPanel): ChatWindow {
        for (const chatWindow of this.tabPanel.widgets) {
            if ((chatWindow as ChatWindow).nbPanel.id == nbPanel.id) {
                return chatWindow as ChatWindow
            }
        }
    }

    public focus = (nbPanel: NotebookPanel) => {
        let cw = this.getChatWindow(nbPanel)
        if (cw) {
            this.tabPanel.currentWidget = this.getChatWindow(nbPanel)
            this.setTitle(nbPanel)
        } else {
            this.setTitle(null)
            this.tabPanel.currentIndex = -1
        }
    }

    public addWindow = (nbPanel: NotebookPanel) => {
        let theWindow = this.getChatWindow(nbPanel)
        if (!theWindow) {
            theWindow = new ChatWindow(nbPanel)
            this.tabPanel.addWidget(theWindow)
        } else {
            this.focus(nbPanel)
        }
        return theWindow
    }

    public removeWindow = (nbPanel: NotebookPanel) => {
        let existingWindow = this.getChatWindow(nbPanel)
        if (existingWindow) {
            existingWindow.dispose()
        }
    }
}

export class ChatWindow extends Widget {

    private input: HTMLInputElement
    private outArea: HTMLElement
    private submitButton: HTMLButtonElement
    public readonly nbPanel: NotebookPanel
    private _userMessage = new Signal<this, string>(this)

    constructor(nbPanel: NotebookPanel) {
        super();
        this.nbPanel = nbPanel;
        let nbTitle = nbPanel.title.label
        this.id = `henry-widow-${nbPanel.id}`
        this.addClass('henry-chat-window');
        this.title.label = `Henry for ${nbTitle}`;
        this.title.closable = true;
        this.render()
        this.addReply(`Hi, how can I help you with your notebook "${nbTitle}"?`)
    }

    get userMessage(): ISignal<this, string> {
        return this._userMessage;
    }

    private handelSubmit = (evt: Event) => {
        this.submitMsg()
    }

    private handelKeyup = (evt: KeyboardEvent) => {
        if (evt.keyCode == 13) { // enter (at least on my key board :) )
            this.submitMsg()
        }
    }

    private submitMsg() {
        let msg = this.input.value
        this.showUserMsg(msg)
        this.input.value = ''
        this._userMessage.emit(msg)
    }

    private showUserMsg(msg: string) {
        let msgContainer = document.createElement('div')
        msgContainer.className = 'henry-message user-message'
        msgContainer.innerText = msg
        this.outArea.appendChild(msgContainer)
    }

    public addReply = (msg: string) => {
        let msgContainer = document.createElement('div')
        msgContainer.className = 'henry-message bot-message'
        msgContainer.innerText = msg
        this.outArea.appendChild(msgContainer)
    }

    private render() {
        this.submitButton = document.createElement('button')
        this.outArea = document.createElement('div')
        this.input = document.createElement('input')

        this.input.placeholder = 'Ask me something'

        this.submitButton.innerText = "Send"
        this.submitButton.addEventListener('click', this.handelSubmit)
        this.input.addEventListener('keyup', this.handelKeyup)

        this.node.appendChild(this.outArea)
        this.node.appendChild(this.submitButton)
        this.node.appendChild(this.input)
    }



}
