import { HenryIntent, Intent, DataLoadIntent } from "./intents";
import { NotebookPanel, NotebookActions } from "@jupyterlab/notebook";

export class IntentHandler {

    public static handelIntent(intent: HenryIntent, nbp: NotebookPanel) {
        switch (intent.type) {
            case Intent.LoadData:
                this.loadData(intent as DataLoadIntent, nbp)
        }
    }

    private static loadData(intent: DataLoadIntent, nbPanel: NotebookPanel) {
        let nb = nbPanel.content
        let cell = nb.model.contentFactory.createCodeCell({})
        let insertAt = nb.activeCellIndex + 1
        nb.model.cells.insert(insertAt, cell)
        cell.value.text = "import intake"

        nb.activeCellIndex = 0
        NotebookActions.run(nb /*, context.session*/)

    }
}