import {
    DocumentRegistry
} from '@jupyterlab/docregistry';

import {
    NotebookActions, NotebookPanel, INotebookModel
} from '@jupyterlab/notebook';


import {
    ToolbarButton
} from '@jupyterlab/apputils';


import {
    IDisposable, DisposableDelegate
} from '@phosphor/disposable';
import '../style/index.css';



/**
 * A notebook widget extension that adds a button to the toolbar.
 */
export
    class StartChatBotButton implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
    /**
     * Create a new extension object.
     */
    createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {

        let notebook = panel.content;

        let callback = () => {
            console.log('clicked')
            let cell = panel.model.contentFactory.createCodeCell({})
            panel.model.cells.insert(0, cell)
            cell.value.text = "print('hi')"

            notebook.activeCellIndex = 0
            NotebookActions.run(notebook, context.session)

            NotebookActions.runAll(notebook, context.session);
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