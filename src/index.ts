import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

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



/**
 * A notebook widget extension that adds a button to the toolbar.
 */
export
  class StartChatBotButton implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  /**
   * Create a new extension object.
   */
  createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {
    console.log(panel, context);
    (<any>window).context = context;
    (<any>window).panel = panel;
    let callback = () => {
      console.log('clicked')
      let cell = panel.model.contentFactory.createCodeCell({})
      cell.value.text = "print('hi')"
      panel.model.cells.insert(0, cell)
      // NotebookActions.runAll(panel.notebook, context.session);
    };
    let startButton = new ToolbarButton({
      className: 'myButton',
      onClick: callback,
      tooltip: 'Run All',

      iconClassName: 'fa fa-commenting'
    });

    // let span = document.createElement('span');
    // span.classList.add('fa', 'fa-fast-forward');
    // button.node.appendChild(span);

    // button.

    panel.toolbar.insertItem(0, 'runAll', startButton);
    return new DisposableDelegate(() => {
      startButton.dispose();
    });
  }
}




/**
 * Initialization data for the henry extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'henry',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension henry 10 is activated!');

    app.docRegistry.addWidgetExtension('Notebook', new StartChatBotButton());
    (<any>window).app = app;



  }
};




export default extension;



