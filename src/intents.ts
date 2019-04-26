import { INotebookModel, NotebookPanel } from "@jupyterlab/notebook";
import { DocumentRegistry } from "@jupyterlab/docregistry";

export enum Intent {
    LoadData = "LoadData",
    Unknown = "Unkown",
    CreateCluster = "CreateCluster"
}

export class HenryIntent {
    readonly orgMsg: string
    readonly type: Intent

    constructor(msg: string) {
        this.orgMsg = msg
    }
}

export class UnknownIntent extends HenryIntent {
    type = Intent.Unknown

    constructor(msg: string) {
        super(msg)
    }
}

export class CreateClusterIntent extends HenryIntent {
    type = Intent.CreateCluster
    public readonly min: number = null
    public readonly max: number = null

    constructor(msg: string, min: number, max: number) {
        super(msg)
        if (isNumber(min) && min >= 0) {
            this.min = Math.floor(min)
        }
        if (isNumber(max) && max >= 1) {
            this.max = Math.floor(max)
        }
        if (isNumber(max) && isNumber(min) && (min > max)) {
            this.max = null
            this.min = null
        }
    }
}

export class DataLoadIntent extends HenryIntent {
    type = Intent.LoadData
    public readonly dataset: string
    public readonly param: string

    constructor(msg: string, dataset: string, param: string) {
        super(msg)
        this.dataset = dataset
        this.param = param
    }
}

export interface IntentParser {
    getIntent(msg: string): Promise<HenryIntent>
}


export interface IntentHandler {
    handelIntent(intent: HenryIntent, notebookPanel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): Promise<string>
}

function isNumber(number: any) {
    return typeof number === "number" && !isNaN(number)
}