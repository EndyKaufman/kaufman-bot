import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { stringify } from 'yaml';
import { HOST_TYPE } from './constants';
import { projectNamespaceYaml } from './project/0.namespace.yaml';
import { projectConfigmapYaml } from './project/1.configmap.yaml';
import { projectIssuerYaml } from './project/2.issuer.yaml';
import { botDeploymentYaml } from './project/bot/0.bot-deployment.yaml';
import { botServiceYaml } from './project/bot/1.bot-service.yaml';
import { botIngressYaml } from './project/bot/2.bot-ingress.yaml';

const PROJECTS_CONFIG = {
  [`./k8s/${HOST_TYPE}/0.namespace.yaml`]: projectNamespaceYaml,
  [`./k8s/${HOST_TYPE}/1.configmap.yaml`]: projectConfigmapYaml,
  [`./k8s/${HOST_TYPE}/2.bot-deployment.yaml`]: botDeploymentYaml,
  [`./k8s/${HOST_TYPE}/3.bot-service.yaml`]: botServiceYaml,
  [`./k8s/${HOST_TYPE}/4.issuer.yaml`]: projectIssuerYaml,
  [`./k8s/${HOST_TYPE}/5.bot-ingress.yaml`]: botIngressYaml,
};

Object.keys(PROJECTS_CONFIG).map((file) => {
  if (!existsSync(dirname(file))) {
    mkdirSync(dirname(file), { recursive: true });
  }
  writeFileSync(file, stringify(PROJECTS_CONFIG[file]));
});
