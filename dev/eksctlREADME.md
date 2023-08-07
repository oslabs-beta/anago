# EKS Setup

## Pre-reqs

- AWS CLI
- Minikube/kubectl
- eksctl
- docker

## Log in and Authenticate

1. Log in to aws.amazon.com as IAM user with Account ID: 180202761917, user:
   **\***, pwd: **\***!
2. From command line, run ‘aws configure’ and enter AuthID and AuthSecret
   AuthID: **\*** AuthSecret: **\***
3. Entering your credentials automatically creates the secret file:
   ~/.aws/config. Find the file on your local machine by typing
   'command-shift-g' within your Finder. You have to change the secret file to
   the following:

> [default] region = us-east-2
>
> [profile schlep] region = us-east-2 output = json
>
> [profile S3FullAccess] role_arn = arn:aws:iam::180202761917:role/Admin-Kub
> source_profile = schlep region = us-east-2

Note: (Notes on the importance of the region, etc.)

## eksctl setup

1. `eksctl create cluster --name [test-cluster] --region us-east-2 --node-type [t2.micro] --nodes [2]`
2. eksctl will add a config file in ~/.kube that directs local kubectl commands
   to your EKS instance.
3. To access elsewhere, run this code:
   `aws eks update-kubeconfig --region us-east-2 --name [test-cluster]`

## Loading the image to ECR

1. Create an image repo in ECR, if there isn’t one
2. the software folder should have a Dockerfile
3. From ECR’s image repo (must be in the right region), click “View Push
   Commands”
4. Run these exact commands in order in order to hand amazon auth info to docker
   (expires after 12 hours), build and tag a docker image, and push it up to
   amazon WHAT EXACT COMMANDS?!
5. NOTE: If using an M1 Mac, you MUST modify the docker build command in order
   to correct the build platform:
   `docker buildx build --platform linux/amd64 -t [pithy] .`

## Deployment + Services

1. Use kubectl to deploy deployment(+pods) and services as usual (see Kubernetes
   Deployment doc), using the ECR image link. For example:
   `kubectl apply -f aws-pithy.yaml` (modify aws-pithy image uri) -or-
   `kubectl create deployment [Depl-name] --image=[180202761917.dkr.ecr.us-east-2.amazonaws.com/pithy]`
2. `kubectl get svc` should surface the Service’s external IP, now accessible

## Make the Metrics available

1. Connect to your desired EKS cluster
   `aws eks --region region update-kubeconfig --name cluster_name`
2. Run the configuration to deploy the metrics server
   `kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml`
3. Check to see that the Metrics Pod is up and running and that the /metrics
   endpoint is exposed `kubectl get pods -n kube-system`

## Prometheus + grafana (using Helm)

1. Add the prometheus-community Helm repo and update Helm:
   `helm repo add prometheus-community https://prometheus-community.github.io/helm-charts`
   `helm repo update`
2. Install the prometheus-community Helm repo with a desired release name(i.e.'prometheus') in a created namespace(i.e. 'monitoring'). Also, install the alert manager. For example:
   `helm install prometheus prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace --set alertmanager.persistentVolume.storageClass="gp2",server.persistentVolume.storageClass="gp2"`

NOTE: after the Helm chart has been installed, you should see this:

> NAME: [release-name]
> LAST DEPLOYED: [date]
> NAMESPACE: [namespace]
> default STATUS: deployed REVISION: 1 NOTES: kube-prometheus-stack has beeninstalled.
> Check its status by running: kubectl --namespace default get pods -l "release=[namespace]" Refer to https://github.com/prometheus-operator/kube-prometheus for instructions on how to create and configure Alertmanager and Prometheus instances using the Operator.

3. use kubectl to see what is installed in the cluster:
   `kubectl get pod -n [namespace]`
   NOTE: you should see all nodes including the
   prometheus stack operator, the alert manager, and grafana
4. use kubectl to see all services: `kubectl get services -n [namespace]`
5. to access your prometheus instance, use the kubectl port-forward to forward a
   local port into the Cluster with the service name. Example (with a service name):
   `kubectl port-forward svc/prometheus-kube-prometheus-prometheus -n [namespace] 4001:9090`
6. navigate to http://localhost:9090 in your browser. NOTE: you should see the Prometheus web UI. Click Status, then Targets to see a list of preconfigured scrape targets. You can use a similar procedure to access the Grafana and Alertmanager web interfaces.

## sending metrics to grafana cloud

Prereqs: Set up a grafana cloud account NOTES: To find your remote write
endpoint, username, and password, navigate to your stack in the Cloud portal,
and click Details next to the Prometheus panel.

1.  use kubectl to create a Kubernetes Secret (called kubepromsecret) to store
    your Grafana Cloud Prometheus username and password
    `kubectl create secret generic kubepromsecret --from-literal=username=[username]} --from-literal=password=[API_TOKEN] -n monitoring`
2.  in VS code, create a values.yaml file or update the current one and add this snippet to define a new Prometheus' remote_write configuration to the Kube-Prometheus release:
    > prometheus:
    > prometheusSpec:
    > remoteWrite:
    >
    > - url: "<Your Cloud Prometheus instance remote_write endpoint>"
    >   basicAuth:
    >   username:
    >   name: kubepromsecret
    >   key: username
    >   password:
    >   name: kubepromsecret
    >   key: password
    >
    > replicaExternalLabelName: "**replica**"
    > externalLabels: {cluster: "[clustername]"}
            NOTE: this snippet will set the remote_write url and use the username and password from the Kubernetes Secret
3.  save and close the file
4.  apply the yaml file in the anago folder with the corrent file path:
    `helm upgrade -f dev/values.yaml [release_name] prometheus-community/kube-prometheus-stack -n [namespace]`
    NOTE: you can get a list of installed releases with
    `helm list -n [namespace]`
5.  after applying those changes, use port-forward to navigate to the prometheus
    UI using the correct service:
    `kubectl port-forward svc/prometheus-kube-prometheus-prometheus -n [namespace] 4001:9090`
6.  Navigate to http://localhost:9090 in your browser, and then click Status and
    Configuration. Verify that the remote_write block you appended above has
    propagated to your running Prometheus instance.
7.  Log in to your managed Grafana instance to begin querying your Cluster data.
    You can use the Billing/Usage dashboard to inspect incoming data rates in
    the last five minutes to confirm the flow of data to Grafana Cloud.

## import dashboards
