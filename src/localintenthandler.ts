import { IntentHandler, HenryIntent, Intent, DataLoadIntent, CreateClusterIntent } from "./intents";
import { DocumentRegistry } from "@jupyterlab/docregistry";
import { INotebookModel, NotebookPanel, NotebookActions, Notebook } from "@jupyterlab/notebook";
import { findCubes } from "./datacat";
import { func } from "prop-types";
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

function handelCluster(intent: CreateClusterIntent, nbp: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): string {
    let nb = nbp.content
    let code = `import dask_kubernetes\nimport distributed\cluster = dask_kubernetes.KubeCluster()\n`
    let args = []
    if (typeof intent.min === 'number') {
        args.push(`min=${intent.min}`)
    }
    if (typeof intent.max === 'number') {
        args.push(`max=${intent.max}`)
    }
    let argStr = args.join(', ')
    code += `cluster.adapt(${argStr})\nclient = distributed.Client(cluster)\ncluster`
}

function handelLoadDate(intent: DataLoadIntent, nbp: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): string {
    let nb = nbp.content
    let cubes = findCubes(intent.param, intent.dataset)


    if (!cubes) {
        return `Sorry, I couldn't find data for ${intent.param} in ${intent.dataset}.`
    }

    let code = "import intake\n"
    code += `henry_loaded_data = [` + cubes.map(cube => `intake.cat.${cube.key}.read()`).join(',') + `]\n`
    code += "henry_loaded_data"

    let msg = `I hope this helps... I loaded ${intent.param} from ${intent.dataset}`;
    let cell = nb.model.contentFactory.createCodeCell({})
    let insertAt = nb.activeCellIndex + 1
    nb.model.cells.insert(insertAt, cell)
    cell.value.text = code
    nb.activeCellIndex = insertAt
    NotebookActions.run(nb, context.session)
    return msg
}

function addCell(code, nb: Notebook) {

}
