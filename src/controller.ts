import { NotebookPanel } from "@jupyterlab/notebook";
import { getHenryState } from "./state";
import { ChatWindowCollection } from "./chatwindow";

export class HenryController {
    private chatWindowCollection: ChatWindowCollection;

    private createChatWindowCollection(panel: NotebookPanel) {
        this.chatWindowCollection = new ChatWindowCollection();
        getHenryState().getApp().shell.addToMainArea(
            this.chatWindowCollection.tabPanel, { mode: 'split-right', ref: panel.id });
        this.chatWindowCollection.tabPanel.disposed.connect(() => {
            this.chatWindowCollection = null
        })
    }

    private createIfNeeded(notebook: NotebookPanel) {
        if (!this.chatWindowCollection) {
            this.createChatWindowCollection(notebook)
        }
    }

    newNotebook(notebook: NotebookPanel) {
        notebook.activated.connect((nb: NotebookPanel) => {
            if (this.chatWindowCollection) {
                this.chatWindowCollection.focus(nb)
            }
        })
    }

    activate(notebook: NotebookPanel) {
        this.createIfNeeded(notebook)
        this.chatWindowCollection.addWindow(notebook)
        this.chatWindowCollection.focus(notebook)
        notebook.disposed.connect((nb: NotebookPanel) => {
            if (this.chatWindowCollection) {
                this.chatWindowCollection.removeWindow(nb)
            }
        })
    }
}