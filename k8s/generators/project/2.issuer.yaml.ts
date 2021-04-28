import { HostType, HOST_TYPE, LETSENCRYPT_EMAIL } from '../constants';

export const projectIssuerYaml = {
  apiVersion: `cert-manager.io/v1alpha2`,
  kind: `ClusterIssuer`,
  metadata: {
    name: `letsencrypt-${HOST_TYPE}`,
    namespace: `cert-manager`,
  },
  spec: {
    acme: {
      server: HOST_TYPE === HostType.Local ? `https://acme-staging-v02.api.letsencrypt.org/directory` : `https://acme-v02.api.letsencrypt.org/directory`,
      email: LETSENCRYPT_EMAIL,
      privateKeySecretRef: {
        name: `letsencrypt-${HOST_TYPE}`,
      },
      solvers: [
        {
          http01: {
            ingress: {
              class: `nginx`,
            },
          },
        },
      ],
    },
  },
};
