import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';
import { StartChatBotButton } from './btn';
import { getHenryState } from './state';


/**
 * Initialization data for the henry extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'henry',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension henry 35 is activated!');
    getHenryState().setApp(app)
    app.docRegistry.addWidgetExtension('Notebook', new StartChatBotButton());
  }
};


export default extension;



