import { HOST_TYPE, LETSENCRYPT_EMAIL, PROJECT_NAME } from '../constants';

export const projectIssuerYaml = {
    apiVersion: `cert-manager.io/v1alpha2`,
    kind: `ClusterIssuer`,
    metadata: {
        namespace: `${PROJECT_NAME}-${HOST_TYPE}`,
        name: `letsencrypt-${HOST_TYPE}`,
    },
    spec: {
        acme: {
            server: `https://acme-v02.api.letsencrypt.org/directory`,
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
