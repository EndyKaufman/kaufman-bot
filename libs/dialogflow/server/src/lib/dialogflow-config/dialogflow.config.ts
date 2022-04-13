export const DIALOGFLOW_CONFIG = 'DIALOGFLOW_CONFIG';

export interface DialogflowConfig {
  title: string;
  name: string;
  descriptions: string;
  usage: string[];
  spyWords: string[];
  projectId: string;
  category: string;
}
