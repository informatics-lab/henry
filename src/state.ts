import { JupyterLab } from "@jupyterlab/application";

let state: State

export function getHenryState(): State {
    if (state) {
        return state
    } else {
        state = new TheState()
        return state
    }

}

export interface State {
    getApp(): JupyterLab
    setApp(app: JupyterLab): void
}

class TheState {
    private app: JupyterLab

    getApp(): JupyterLab {
        return this.app
    }

    setApp(app: JupyterLab): void {
        this.app = app
    }
}