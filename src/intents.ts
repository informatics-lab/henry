
export enum Intent {
    LoadData = "LoadData",
    Unknown = "Unkown"
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

export class DataLoadIntent extends HenryIntent {
    type = Intent.LoadData
    readonly dataset: string
    readonly param: string

    constructor(msg: string, dataset: string, param: string) {
        super(msg)
        this.dataset = dataset
        this.param = param
    }
}


export interface IntentParser {
    getIntent(msg: string): Promise<HenryIntent>
}
