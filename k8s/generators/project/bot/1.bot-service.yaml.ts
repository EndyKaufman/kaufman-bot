import { Service } from 'kubernetes-types/core/v1';
import { HOST_TYPE, PROJECT_NAME } from '../../constants';

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
                port: 5000,
                targetPort: 5000,
            },
        ],
        type: `ClusterIP`,
    },
} as Service;
