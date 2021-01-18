import { Service } from 'kubernetes-types/core/v1';
import { HOST_TYPE, PORT, PROJECT_NAME } from '../../constants';

export const botServiceYaml = {
  kind: `Service`,
  apiVersion: `v1`,
  metadata: {
    namespace: `${PROJECT_NAME}-${HOST_TYPE}`,
    name: `${PROJECT_NAME}-bot-service`,
  },
  spec: {
    selector: {
      pod: `${PROJECT_NAME}-bot-container`,
    },
    ports: [
      {
        protocol: `TCP`,
        port: +PORT,
        targetPort: +PORT,
      },
    ],
    type: `ClusterIP`,
  },
} as Service;
