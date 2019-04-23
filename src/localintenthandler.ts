import { IntentHandler, HenryIntent, Intent } from "./intents";
import { DocumentRegistry } from "@jupyterlab/docregistry";
import { INotebookModel, NotebookPanel, NotebookActions } from "@jupyterlab/notebook";
export class LocalIntentHandler implements IntentHandler {
    handelIntent(intent: HenryIntent, notebookPanel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): Promise<string> {
        console.log(intent);
        let msg = "Error...";
        switch (intent.type) {
            case Intent.LoadData:
                let nb = notebookPanel.content
                msg = "I hope this helps...";
                let cell = nb.model.contentFactory.createCodeCell({})
                let insertAt = nb.activeCellIndex + 1
                nb.model.cells.insert(insertAt, cell)
                cell.value.text = "import intake"
                nb.activeCellIndex = insertAt
                NotebookActions.run(nb, context.session)
                break;
            case Intent.Unknown:
                msg = "I don't know how to help.";
                break;
        }
        return Promise.resolve(msg);
    }
}
