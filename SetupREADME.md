# Setting up Anago

Welcome to Anago. The first section of this set-up document walks through installing and configuring Anago for an existing cluster with Prometheus available. The rest of the document describes the basic steps of deploying an EKS cluster from scratch, intended for a development or DevOps team newly approaching K8s.

# Setup for Anago:

1. Clone the Anago repository locally and install required modules:

```bash
npm install
```

2. Modify the [user-config.ts](/user-config.ts) file to point to access your Prometheus instance and Alertmanager. For example, forward these services to the default ports (9090 and 9093):

```bash
kubectl port-forward svc/[service-name] -n [namespace] 9090
kubectl port-forward svc/[service-name] -n [namespace] 9093
```

3. Launch Anago from the command line:

```bash
npm run dev
```

Navigate to the local access point for Vite (by default, [http://locahost:5173](http://locahost:5173)), and you should see Anago!
Several core metrics are populated by default (or if `NEW_USER=true` in user-config.ts).

All set? click [here](/README.md) to return to the main README.md

# New to Kubernetes?

Teams without an active cluster will have a longer path for initially setting up Kubernetes and then Anago. The following step-by-step guide will move through one use case for deploying and monitoring a simple cluster using the eksctl tool to configure an EKS cluster on EC2 instances with Prometheus. At the end of these steps, you should be ready to use Anago (described above). Depending on your needs, only some of these steps may be necessary.

NOTE: to deploy K8s cluster locally, consider using [minikube](https://minikube.sigs.k8s.io/docs/)

## Table of Contents

1. [Prerequisites](#Prerequisites)
2. [AWS Login and Authentication](#AWS-Login-and-Authentication)
3. [eksctl Setup](#eksctl-Setup)
4. [Loading the image to ECR](#Loading-the-image-to-ECR)
5. [Deployment + Services](#Deployment-+-Services)
6. [Making the Metrics Available](#Making-the-Metrics-Available)
7. [Prometheus Setup](#Prometheus-Setup-using-Helm)
8. [AlertManager Setup](#AlertManager-Setup)

## Prerequisites

1. For the following setup, the following installations and setups are required:
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

DISCLAIMER: this Anago setup describes a cloudhosted deployment

## AWS Login and Authentication

1. Log in to your personal <a href="aws.amazon.com">AWS</a> account as an IAM user
2. From the command line, run

```bash
aws configure
```

and when prompted, enter your AWS Access Key ID and AWS Secret Access Key 3. Entering your credentials automatically creates the secret file: ~/.aws/config. You are then able to adjust that information as desired.

NOTE: Find the hidden file on your local machine by typing 'command-shift-g' within your Finder.

## eksctl Setup

1. Create a cluster with your desired cluster name, region, node type, and node count

```bash
eksctl create cluster --name [test-cluster] --region [us-east-2] --node-type [t2.micro] --nodes [2]
```

NOTE: eksctl will add a config file in ~/.kube that directs local kubectl commands to your EKS instance.

2. To access this EKS instance elsewhere:

```bash
aws eks update-kubeconfig --region [us-east-2] --name [test-cluster]
```

## Loading the image to ECR

1. Create an image repo in ECR, if there isn’t one
2. the software folder should have a Dockerfile
3. From ECR’s image repo (must be in the right region), click “View Push Commands”
4. Run these exact commands in order in order to hand amazon auth info to docker (expires after 12 hours), build and tag a docker image, and push it up to amazon

NOTE: If using an M1 Mac, you MUST modify the docker build command in order to correct the build platform:

```bash
docker buildx build --platform linux/amd64 -t [image] .
```

## Deployment + Services

1. Use kubectl to deploy deployment(+pods) and services as usual (see KubernetesDeployment doc), using the ECR image link. For example:

```bash
kubectl apply -f [yaml file]
```

OR

```bash
kubectl create deployment [Depl-name] --image=[image]
```

2. To surface the Service's external IP, run this command:

```bash
kubectl get svc
```

## Making the Metrics Available

1. Connect to your desired EKS cluster:

```bash
aws eks --region region update-kubeconfig --name [cluster-name]
```

2. Run the configuration to deploy the metrics server

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

3. Check to see that the Metrics Pod is up and running and that the /metrics endpoint is exposed

```bash
kubectl get pods -n kube-system
```

## Prometheus Setup (using Helm)

1. Add the prometheus-community Helm repo and update Helm:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
```

```bash
helm repo update
```

2. Install the prometheus-community Helm repo with a desired release name in a created namespace. Also,
   install the alert manager. For example:

```bash
helm install [release-name] prometheus-community/kube-prometheus-stack --namespace [namespace] --create-namespace --set alertmanager.persistentVolume.storageClass="gp2",server.persistentVolume.storageClass="gp2"
```

NOTE: after the Helm chart has been installed, you should see this:

> NAME: [release-name] LAST DEPLOYED: [date] NAMESPACE: [namespace] default
> STATUS: deployed REVISION: 1 NOTES: kube-prometheus-stack has beeninstalled.
> Check its status by running: kubectl --namespace default get pods -l
> "release=[namespace]" Refer to
> https://github.com/prometheus-operator/kube-prometheus for instructions on how
> to create and configure Alertmanager and Prometheus instances using the
> Operator.

3. use kubectl to see what is installed in the cluster:

```bash
kubectl get pod -n [namespace]
```

NOTE: you should see all nodes including the prometheus stack operator, the alert manager, and grafana

4. use kubectl to see all services:

```bash
kubectl get services -n [namespace]
```

5. to access your prometheus instance, use the kubectl port-forward to forward a local port into the Cluster with the service name. Example:

```bash
kubectl port-forward svc/[service-name] -n [namespace] 9090
```

6. navigate to http://localhost:9090 in your browser to access the Prometheus web UI.

NOTE: Click Status, then Targets to see a list of scrape targets configured by Helm.

NOTE: if you'd like more general information regarding Prometheus, [click here](./dev/prometheusREADME.md)

## AlertManager Setup

NOTE: the prometheus-community/kube-prometheus-stack includes configuration files for AlertManager.

1. to access the alertManager UI, use the kubectl port-forward to forward a local port into the Cluster with the service name. Example:

```bash
kubectl port-forward svc/[service-name]  -n monitoring 9093
```

2. navigate to http://localhost:9093 in your browser to access the AlertManager web UI.

NOTE: You can see the active alerts configured by Helm. if more customization regarding alerts is needed, the configuration files may be adjusted and applied.

NOTE: if you'd like more information regarding AlertManager, [click here](./dev/alertManagerInfo.md)
