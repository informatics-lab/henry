import { IntentHandler, HenryIntent, Intent, DataLoadIntent } from "./intents";
import { DocumentRegistry } from "@jupyterlab/docregistry";
import { INotebookModel, NotebookPanel, NotebookActions } from "@jupyterlab/notebook";
import { findCubes } from "./datacat";
export class LocalIntentHandler implements IntentHandler {
    handelIntent(intent: HenryIntent, notebookPanel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): Promise<string> {
        console.log(intent);
        let msg = "Error...";
        switch (intent.type) {
            case Intent.LoadData:
                msg = handelLoadDate((intent as DataLoadIntent), notebookPanel, context)
                break;
            case Intent.Unknown:
                msg = "I don't know how to help.";
                break;
        }
        return Promise.resolve(msg);
    }
}

function handelLoadDate(intent: DataLoadIntent, nbp: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): string {
    let nb = nbp.content
    let cubes = findCubes(intent.param, intent.dataset)


    if (!cubes) {
        return `Sorry, I couldn't find data for ${intent.param} in ${intent.dataset}.`
    }

    let code = "import intake\n"
    code += `henry_loaded_data = [` + cubes.map(cube => `intake.cat.${cube.key}.read()`).join(',') + `]\n`
    code += 'henry_loaded_data'

    let msg = "I hope this helps...";
    let cell = nb.model.contentFactory.createCodeCell({})
    let insertAt = nb.activeCellIndex + 1
    nb.model.cells.insert(insertAt, cell)
    cell.value.text = code
    nb.activeCellIndex = insertAt
    NotebookActions.run(nb, context.session)
    return msg
}