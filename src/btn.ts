import {
    DocumentRegistry
} from '@jupyterlab/docregistry';

import {
    NotebookPanel, INotebookModel
} from '@jupyterlab/notebook';


import {
    ToolbarButton
} from '@jupyterlab/apputils';


import {
    IDisposable, DisposableDelegate
} from '@phosphor/disposable';
import '../style/index.css';
import { JupyterLab } from '@jupyterlab/application';
import { HenryController } from './controller';


/**
 * A notebook widget extension that adds a button to the toolbar.
 */
export class StartChatBotButton implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
    requires: [JupyterLab]
    private controller: HenryController;

    constructor() {
        this.controller = new HenryController()
    }


    /**
     * Create a new extension object.
     */
    createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {
        this.controller.newNotebook(panel)

        let callback = () => {
            this.controller.activate(panel)
        };

        let openChatBtn = new ToolbarButton({
            className: 'chatBtn',
            onClick: callback,
            tooltip: 'Launch Henry',

            iconClassName: 'fa fa-commenting'
        });


        panel.toolbar.insertItem(0, 'chat', openChatBtn);
        return new DisposableDelegate(() => {
            openChatBtn.dispose();
        });
    }
}