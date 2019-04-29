import { IntentHandler, HenryIntent, Intent, DataLoadIntent, CreateClusterIntent } from "./intents";
import { DocumentRegistry } from "@jupyterlab/docregistry";
import { findCubes } from "./datacat";
import { INotebookModel, NotebookPanel, Notebook, NotebookActions } from "@jupyterlab/notebook";
import { Cell } from "@jupyterlab/cells";

const HELLO_RESPONSE = [
    "Hi there! Would you like some data?",
    "Hello, I'm here to help.",
    "Hey! What would you like?",
]

const THANKYOU_RESPONSE = [
    "No problem",
    "You're welcome",
    "Happy to help",
]

export class LocalIntentHandler implements IntentHandler {
    handelIntent(intent: HenryIntent, notebookPanel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): Promise<string> {
        console.log(intent);
        let msg = "Error...";
        switch (intent.type) {
            case Intent.LoadData:
                msg = handelLoadDate((intent as DataLoadIntent), notebookPanel, context)
                break;

            case Intent.Greeting:
                msg = random(HELLO_RESPONSE);
                break;

            case Intent.Thankyou:
                msg = random(THANKYOU_RESPONSE);
                break;

            case Intent.CreateCluster:
                msg = handelCluster(intent as CreateClusterIntent, notebookPanel, context)
                break;

            case Intent.Unknown:
                msg = "I'm sorry, I don't know how to help. Try asking for some data?";
                break;
        }
        return Promise.resolve(msg);
    }
}

function handelCluster(intent: CreateClusterIntent, nbp: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): string {
    let nb = nbp.content
    let code = `import dask_kubernetes\nimport distributed\ncluster = dask_kubernetes.KubeCluster()\n`
    let args = []
    if (typeof intent.min === 'number') {
        args.push(`min=${intent.min}`)
    }
    if (typeof intent.max === 'number') {
        args.push(`max=${intent.max}`)
    }
    let argStr = args.join(', ')
    code += `cluster.adapt(${argStr})\nclient = distributed.Client(cluster)\ncluster`
    addCell(code, nb, context)
    return `Here's a cluster for you.`

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
    if (cubes.length > 20) {
        return `Sorry, I found more than 20 datasets that match param:${intent.param} and model:${intent.dataset}. Can you be more precise?`
    }
    let varName = intent.param ? intent.param : intent.dataset;
    varName = varName.toLowerCase().replace(/[ -]+/gi,'_').replace(/[^_a-z]+/gi,'')

    let code = "import intake\n"
    if(cubes.length == 1){
        code += `${varName} = intake.cat.${cubes[0].key}.read()`
    } else {
        code += `${varName} = [\n    ` + cubes.map(cube => `intake.cat.${cube.key}.read()`).join(',\n    ') + `\n]`
    }
    code += `\n${varName}`
    addCell(code, nb, context)
    let msg = `I hope this helps... I loaded ${intent.param} from ${intent.dataset}`;

    return msg
}

function addCell(code: string, nb: Notebook, context: DocumentRegistry.IContext<INotebookModel>, run = true) {
    let cell = nb.model.contentFactory.createCodeCell({})
    let insertAt = nb.activeCellIndex + 1
    nb.model.cells.insert(insertAt, cell)
    cell.value.text = code
    nb.activeCellIndex = insertAt
    nb.scrollToPosition(100)

    if (run) {
        NotebookActions.run(nb, context.session)
    }
    let cellWidget = nb.widgets[insertAt];

    nb.scrollToPosition(cellWidget.node.offsetTop, 20)
    cellWidget.node.classList.add('henry-cell')
    flashCell(cellWidget, 10)
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
function random(array: any[] | string[]) {
    return array[Math.floor(Math.random() * array.length)];
}

