## Prerequisites

1. Before working with Anago, the following installations and setups are required:
   - [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
   - [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html)
   - [kubectl](https://kubernetes.io/docs/tasks/tools/)
   - [Docker Desktop](https://www.docker.com/products/docker-desktop/)
1. Fork the <a href="https://github.com/oslabs-beta/anago"> Anago repository </a> to your personal GitHub account.
1. Clone the forked repository to your local computer.
1. In the Anago folder of your local repository, install all the dependencies

```bash
npm install
```

# AWS Login and Authentication

1. Log in to your personal <a href="aws.amazon.com">AWS<a> account as an IAM user
2. From the command line, run `aws configure` and when prompted, enter your AWS Access Key ID and AWS Secret Access Key
3. Entering your credentials automatically creates the secret file: ~/.aws/config. You are then able to adjust that information as desired.
   NOTE: Find the hidden file on your local machine by typing 'command-shift-g' within your Finder.

# eksctl Setup

1. Create a cluster with your desired cluster name, region, node type, and node count
   `eksctl create cluster --name [test-cluster] --region [us-east-2] --node-type [t2.micro] --nodes [2]`
   NOTE: eksctl will add a config file in ~/.kube that directs local kubectl commands to your EKS instance.
2. To access this EKS instance elsewhere:
   `aws eks update-kubeconfig --region [us-east-2] --name [test-cluster]`

# Deployment + Services

1. Use kubectl to deploy deployment(+pods) and services as usual (see KubernetesDeployment doc), using the ECR image link. For example:
   `kubectl apply -f [yaml file]` -or-
   `kubectl create deployment [Depl-name] --image=[image]`
2. `kubectl get svc` should surface the Service’s external IP, now accessible

# Making the Metrics Available

1. Connect to your desired EKS cluster
   `aws eks --region region update-kubeconfig --name [cluster-name]`
2. Run the configuration to deploy the metrics server
   `kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml`
3. Check to see that the Metrics Pod is up and running and that the /metrics endpoint is exposed
   `kubectl get pods -n kube-system`

# Prometheus Setup (using Helm)

1. Add the prometheus-community Helm repo and update Helm:
   `helm repo add prometheus-community https://prometheus-community.github.io/helm-charts`
   `helm repo update`
2. Install the prometheus-community Helm repo with a desired release name in a created namespace. Also,
   install the alert manager. For example:
   `helm install [release-name] prometheus-community/kube-prometheus-stack --namespace [namespace] --create-namespace --set alertmanager.persistentVolume.storageClass="gp2",server.persistentVolume.storageClass="gp2"`

NOTE: after the Helm chart has been installed, you should see this:

> NAME: [release-name] LAST DEPLOYED: [date] NAMESPACE: [namespace] default
> STATUS: deployed REVISION: 1 NOTES: kube-prometheus-stack has beeninstalled.
> Check its status by running: kubectl --namespace default get pods -l
> "release=[namespace]" Refer to
> https://github.com/prometheus-operator/kube-prometheus for instructions on how
> to create and configure Alertmanager and Prometheus instances using the
> Operator.

3. use kubectl to see what is installed in the cluster:
   `kubectl get pod -n [namespace]`
   NOTE: you should see all nodes including the prometheus stack operator, the alert manager, and grafana
4. use kubectl to see all services: `kubectl get services -n [namespace]`
5. to access your prometheus instance, use the kubectl port-forward to forward a local port into the Cluster with the service name. Example:
   `kubectl port-forward svc/[service-name] -n [namespace] 9090`
6. navigate to http://localhost:9090 in your browser to access the Prometheus web UI.
   NOTE: Click Status, then Targets to see a list of scrape targets configured by Helm.

# AlertManager Setup

NOTE: the prometheus-community/kube-prometheus-stack includes configuration files for AlertManager.

1. to access the alertManager UI, use the kubectl port-forward to forward a
   local port into the Cluster with the service name. Example:
   `kubectl port-forward svc/[service-name]  -n monitoring 9093`
2. navigate to http://localhost:9093 in your browser to access the AlertManager web UI.
   NOTE: You can see the active alerts configured by Helm. if more customization regarding alerts is needed, the configuration files may be adjusted and applied.
