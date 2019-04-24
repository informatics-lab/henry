import { Widget, TabPanel } from "@phosphor/widgets";
import { NotebookPanel } from "@jupyterlab/notebook";
import { RegExpIntentParser } from './regexintentparser';
import { UUID } from "@phosphor/coreutils";
import { HenryIntent, Intent } from "./intents";

let intentParser = new RegExpIntentParser();

export class ChatWindowCollection {

    public readonly tabPanel: TabPanel

    constructor() {
        this.tabPanel = new TabPanel()
        this.tabPanel.title.label = "Henry"
        this.tabPanel.id = UUID.uuid4()
        // TODO: think about if want below
        // this.tabPanel.currentChanged.connect((tp, args) => {
        //     let chatWindow = (this.tabPanel.widgets[args.currentIndex] as ChatWindow)
        //     if (chatWindow) {
        //         this.setTitle(chatWindow.nbPanel)
        //     }
        // })
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

    private getChatWindow(nbPanel: NotebookPanel) {
        for (const chatWindow of this.tabPanel.widgets) {
            if ((chatWindow as ChatWindow).nbPanel.id == nbPanel.id) {
                return chatWindow
            }
        }
    }

    public focus = (nbPanel: NotebookPanel) => {
        let cw = this.getChatWindow(nbPanel)
        if (cw) {
            this.tabPanel.currentWidget = this.getChatWindow(nbPanel)
            this.setTitle(nbPanel)
            // this.tabPanel.setHidden(false)
        } else {
            this.setTitle(null)
            this.tabPanel.currentIndex = -1
            // this.tabPanel.setHidden(true)
        }
    }

    public addWindow(nbPanel: NotebookPanel) {
        // If already have this chat window just focus
        let existingWindow = this.getChatWindow(nbPanel)
        if (!existingWindow) {
            this.tabPanel.addWidget(new ChatWindow(nbPanel))
        }
    }

    public removeWindow(nbPanel: NotebookPanel) {
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

    constructor(nbPanel: NotebookPanel) {
        super();
        this.nbPanel = nbPanel;
        let nbTitle = nbPanel.title.label
        this.id = `henry-widow-${nbPanel.id}`
        this.addClass('henry-chat-window');
        this.title.label = `Henry for ${nbTitle}`;
        this.title.closable = true;
        this.render()
        this.showReply(`Hi how can I help you with your notebook ${nbTitle}`)
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
        intentParser.getIntent(msg).then(this.handelIntent)
    }

    private handelIntent = (intent: HenryIntent) => {
        console.log(intent)
        let msg = "Error..."

        switch (intent.type) {

            case Intent.LoadData:
                msg = "So you want some data?"
                break;

            case Intent.Unknown:
                msg = "I don't know how to help."
                break;

        }
        this.showReply(msg)
    }

    private showUserMsg(msg: string) {
        let msgContainer = document.createElement('div')
        msgContainer.className = 'user-message'
        msgContainer.innerText = msg
        this.outArea.appendChild(msgContainer)
    }

    private showReply(msg: string) {
        let msgContainer = document.createElement('div')
        msgContainer.className = 'henry-message'
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
