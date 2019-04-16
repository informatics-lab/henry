import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';
import { StartChatBotButton } from './btn';


/**
 * Initialization data for the henry extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'henry',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension henry 16 is activated!');
    app.docRegistry.addWidgetExtension('Notebook', new StartChatBotButton());
    (<any>window).app = app;
  }
};


export default extension;



