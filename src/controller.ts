import { NotebookPanel, INotebookModel } from "@jupyterlab/notebook";
import { getHenryState } from "./state";
import { ChatWindowCollection, ChatWindow } from "./chatwindow";
import { DocumentRegistry } from "@jupyterlab/docregistry";
import { RegExpIntentParser } from "./regexintentparser";
import { LocalIntentHandler } from "./localintenthandler";


export class HenryController {
    private chatWindowCollection: ChatWindowCollection;
    private contexts: Map<NotebookPanel, DocumentRegistry.IContext<INotebookModel>> = new Map()
    private intentParser = new RegExpIntentParser();
    private intentHandler = new LocalIntentHandler();

    private createChatWindowCollection(panel: NotebookPanel) {
        this.chatWindowCollection = new ChatWindowCollection();
        getHenryState().getApp().shell.addToRightArea(this.chatWindowCollection.tabPanel);
        this.chatWindowCollection.tabPanel.disposed.connect(() => {
            this.chatWindowCollection = null
        })
    }

    private createAndShowIfNeeded(notebook: NotebookPanel) {
        if (!this.chatWindowCollection) {
            this.createChatWindowCollection(notebook)
        }
        getHenryState().getApp().shell.expandRight()
    }

    newNotebook(notebookPanel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>) {
        this.contexts.set(notebookPanel, context)
        notebookPanel.activated.connect((nbp: NotebookPanel) => {
            if (this.chatWindowCollection) {
                this.chatWindowCollection.focus(nbp)
            }
        })
        notebookPanel.disposed.connect((nbp: NotebookPanel) => {
            this.contexts.delete(nbp)
        })
    }

    private handelMsg = (chatWindow: ChatWindow, msg: string) => {
        this.intentParser.getIntent(msg)
            .then((intent) => this.intentHandler.handelIntent(intent, chatWindow.nbPanel, this.contexts.get(chatWindow.nbPanel)))
            .then(chatWindow.addReply)
    }

    activate(notebook: NotebookPanel) {
        this.createAndShowIfNeeded(notebook)
        let chatWindow = this.chatWindowCollection.addWindow(notebook)
        chatWindow.userMessage.connect(this.handelMsg)
        this.chatWindowCollection.focus(notebook)
        notebook.disposed.connect((nb: NotebookPanel) => {
            if (this.chatWindowCollection) {
                this.chatWindowCollection.removeWindow(nb)
            }
        })
    }
}