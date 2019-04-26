import { IntentHandler, HenryIntent, Intent, DataLoadIntent } from "./intents";
import { DocumentRegistry } from "@jupyterlab/docregistry";
import { INotebookModel, NotebookPanel /*, NotebookActions */ } from "@jupyterlab/notebook";
import { findCubes } from "./datacat";
import { Cell } from "@jupyterlab/cells";
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

    if (!intent.dataset && !intent.param) {
        return 'Sorry, I didn\'t catch what data and model you wanted. Try saying something like "load rain data from ukv".'
    }

    let nb = nbp.content
    let cubes = findCubes(intent.param, intent.dataset)

    if (cubes.length <= 0) {
        return `Sorry, I couldn't find data for ${intent.param} in ${intent.dataset}.`
    }
    if (cubes.length > 10) {
        return `Sorry, I found more than 10 datasets that match param:${intent.param} and model:${intent.dataset}. Can you be more precise?`
    }

    let code = "import intake\n"
    code += `henry_loaded_data = [\n    ` + cubes.map(cube => `intake.cat.${cube.key}.read()`).join(',\n    ') + `\n]\n`
    code += "henry_loaded_data"

    let msg = `I hope this helps... I loaded ${intent.param} from ${intent.dataset}`;
    let cell = nb.model.contentFactory.createCodeCell({})
    let insertAt = nb.activeCellIndex + 1
    nb.model.cells.insert(insertAt, cell)
    cell.value.text = code
    nb.activeCellIndex = insertAt
    nb.scrollToPosition(100)


    // NotebookActions.run(nb, context.session) // Let's not run the code but we could!

    let cellWidget = nb.widgets[insertAt];

    nb.scrollToPosition(cellWidget.node.offsetTop, 20)
    cellWidget.node.classList.add('henry-cell')
    flashCell(cellWidget, 10)
    return msg
}

function flashCell(cell: Cell, count: number) {
    count -= 1
    if (count <= 0) {
        cell.node.classList.remove('henry-flash')
        return // exit early, all flashed out
    }

    cell.node.classList.toggle('henry-flash')
    setTimeout(() => { flashCell(cell, count) }, 500)

}