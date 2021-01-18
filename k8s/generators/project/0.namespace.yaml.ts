import { Namespace } from 'kubernetes-types/core/v1';
import { HOST_TYPE, PROJECT_NAME } from '../constants';

export const projectNamespaceYaml = {
    apiVersion: `v1`,
    kind: `Namespace`,
    metadata: {
        name: `${PROJECT_NAME}-${HOST_TYPE}`,
    },
} as Namespace;
