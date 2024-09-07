import { Config } from './config.type.js';

export const conf: Config = {
  tlg: {
    apiId: NaN, 
    apiHash: ''
  },
  agent: '',
  botToken: '',
  storagePath: `${process.cwd()}/files/`,
  admins: []
};
