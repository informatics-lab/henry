import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';
import { StartChatBotButton } from './btn';
import { getHenryState } from './state';
import { getCats } from './datacat';


/**
 * Initialization data for the henry extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'henry',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension henry  0.1.6 is activated!');
    getCats()
    getHenryState().setApp(app)
    app.docRegistry.addWidgetExtension('Notebook', new StartChatBotButton());
  }
};


export default extension;



