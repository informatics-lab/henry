import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the henry extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'henry',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension henry is activated!');
  }
};

export default extension;
