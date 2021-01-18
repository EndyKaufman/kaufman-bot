import { Deployment } from 'kubernetes-types/apps/v1';
import { DOCKER_BOT_IMAGE, HostType, HOST_TYPE, PORT, PROJECT_NAME } from '../../constants';

export const botDeploymentYaml = {
  apiVersion: `apps/v1`,
  kind: `Deployment`,
  metadata: {
    namespace: `${PROJECT_NAME}-${HOST_TYPE}`,
    name: `${PROJECT_NAME}-bot`,
    labels: {
      app: `${PROJECT_NAME}-bot`,
    },
  },
  spec: {
    replicas: 1,
    selector: {
      matchLabels: {
        pod: `${PROJECT_NAME}-bot-container`,
      },
    },
    template: {
      metadata: {
        namespace: `${PROJECT_NAME}-${HOST_TYPE}`,
        labels: {
          pod: `${PROJECT_NAME}-bot-container`,
        },
      },
      spec: {
        containers: [
          {
            name: `${PROJECT_NAME}-bot`,
            image: DOCKER_BOT_IMAGE,
            imagePullPolicy: HOST_TYPE === HostType.Prod ? `Always` : `Never`,
            ports: [
              {
                containerPort: +PORT,
              },
            ],

            envFrom: [
              {
                configMapRef: {
                  name: `${PROJECT_NAME}-config`,
                },
              },
            ],
            resources: {
              requests: {
                memory: `64Mi`,
                cpu: `75m`,
              },
              limits: {
                memory: `128Mi`,
                cpu: `150m`,
              },
            },
          },
        ],
      },
    },
  },
} as Deployment;
