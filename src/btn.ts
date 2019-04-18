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
import { createChatWindow } from './chatwindow';
import { UUID } from '@phosphor/coreutils';
import { JupyterLab } from '@jupyterlab/application';
import { getHenryState } from './state';


/**
 * A notebook widget extension that adds a button to the toolbar.
 */
export
    class StartChatBotButton implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
    requires: [JupyterLab]
    /**
     * Create a new extension object.
     */
    createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {
        // let id = uid();
        if (!panel.id) {
            panel.id = UUID.uuid4()
        }

        // panel.node.appendChild(document.cre);
        let callback = () => {

            let app = getHenryState().getApp()
            app.shell.addToMainArea(createChatWindow(panel));
            // app.shell.expandRight();
            // let notebook = panel.content;
            // let cell = panel.model.contentFactory.createCodeCell({})
            // panel.model.cells.insert(0, cell)
            // cell.value.text = "print('hi')"

            // notebook.activeCellIndex = 0
            // NotebookActions.run(notebook, context.session)

        };

        let openChatBtn = new ToolbarButton({
            className: 'chatBtn',
            onClick: callback,
            tooltip: 'Run All',

            iconClassName: 'fa fa-commenting'
        });


        panel.toolbar.insertItem(0, 'chat', openChatBtn);
        return new DisposableDelegate(() => {
            openChatBtn.dispose();
        });
    }
}