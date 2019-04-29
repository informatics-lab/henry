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
    private heading: HTMLElement
    private suggestButton1: HTMLButtonElement
    private suggestButton2: HTMLButtonElement
    private suggestButton3: HTMLButtonElement

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

    private handelSuggest = (evt: Event) => {
        this.input.value = (evt.currentTarget as HTMLElement).innerText
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
        this.heading = document.createElement('div')
        this.heading.innerText = "Henry"
        
        this.suggestButton1 = document.createElement('button')
        this.suggestButton2 = document.createElement('button')
        this.suggestButton3 = document.createElement('button')

        this.submitButton.className = "submit-button"
        this.outArea.className = "henry-output-area"
        this.heading.className = "heading"
        this.input.placeholder = "Ask me something"
        this.suggestButton1.className = "suggest-button1"
        this.suggestButton2.className = "suggest-button2"
        this.suggestButton3.className = "suggest-button3"

        this.suggestButton1.innerText = "Load rain from mogreps"
        this.suggestButton1.addEventListener('click', this.handelSuggest)
        this.suggestButton2.innerText = "Load wind from ukv"
        this.suggestButton2.addEventListener('click', this.handelSuggest)
        this.suggestButton3.innerText = "Load temperature from global"
        this.suggestButton3.addEventListener('click', this.handelSuggest)

        this.submitButton.innerText = "Send"
        this.submitButton.addEventListener('click', this.handelSubmit)
        this.input.addEventListener('keyup', this.handelKeyup)

        this.node.appendChild(this.heading)
        this.node.appendChild(this.outArea)
        this.node.appendChild(this.submitButton)
        this.node.appendChild(this.input)
        this.node.appendChild(this.suggestButton1)
        this.node.appendChild(this.suggestButton2)
        this.node.appendChild(this.suggestButton3)
    }

}

// const BUTTONARRAY = [
//     "Load rain from ukv",
//     "Load wind from mogreps g",
//     "Load temperature from global",
// ]

// var i;

// function buttonLoop() {
//     for (i in BUTTONARRAY) {
//         var element = document.createElement('button') as HTMLElement
//         element.addEventListener('click', function handelSuggest(){});  
//     };
// }

// buttonLoop();