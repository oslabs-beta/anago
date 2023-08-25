# Minikube

If you want to host a cluster on a local server, minikube provides a simple and streamlined way to 'spin up' a single cluster through your command line. If you want to test on a smaller scale, want to test a cluster configuration prior to cloud-deployment, or just start getting comfortable with Kubernetes, minikube is an incredible tool to get started.  Anago's platform supports a Kubernetes cluster deployment with minikube.  All you need is a Docker (or similarly compatible) container.

Before proceeding with these steps, we are assuming that you have installed the following onto your local machine:
- **minikube:** Checkout the minikube docs [here](https://minikube.sigs.k8s.io/docs/start/) for support with your local system architecture.
- **kubectl:** a command line tool that allows you to control the Kubernetes cluster

### Docker Image Build and Pithy
We are also assuming that you have a docker image and docker file.  If you need more assistance with this, we suggest reviewing our 'pithy' folder within the dev folder.  Pithy is a simple Docker containerized application that we provide inbuilt to use as a tool to deploy on your Kubernetes clusters.  You will see the outlined steps below implementing our pithy Docker build in the minikube and kubectl commands.

If you need to read more about Kubernetes components, we suggest you start with the Kubernetes docs, linked [here.](https://kubernetes.io/docs/concepts/overview/components/)

## Minikube Deployment Steps
There are many ways to setup and deploy your minikube. Steps 2-6 listed below have multiple options flagged with '*'. Select the command that works for your system.   
   

### 1. Start minikube
- `minikube start`
  - If successful, you will see the following message in your console:

    `Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default`
    
    Now we can use kubectl to deploy our application to the cluster.

### 2. Build docker image in minikube's environment
1a. `eval $(minikube docker-env)`     
    - Change execution / output context to inside of the minikube container, so the image is available     
1b. `docker build -t [Image-Name] . `   ||  `docker buildx build --platform linux/amd64 -t [pithy] .`
    
  - Requires a Dockerfile, and outputs a Docker image   
  - **NOTE:** If using an M1/M2 Mac, you **MUST** modify the docker build command in order
   to correctly compile the Docker image.  Use the command on the right.
   
[1c]. `docker ssh `  
    - Ssh into docker, in order to...   
[1d]. `docker images `     
    - Check local image directory to ensure your custom image is available   

### 3. Fire up your deployments
* `kubectl apply -f pithy.yaml ` _(or your own configuration yaml file)_
  - Launch deployment from a yaml file with image available (needs image-pull-policy:OnDemand or Never)
* `kubectl run [depl-name] --image=[Image-Name] --image-pull-policy=Never`
  - Run the deployment with a target image. image-pull-policy looks local, instead of fetching
* `kubectl create deployment [Depl-name] --image=[Image-Name]`
  - Create a deployment from the target image

### 4. Fire up your service
* `kubectl apply -f [pithy-service.yaml]` _(or your own service config yaml file)_
  - spec.selector.app (in service) must point to spec.containers.name (in the deployment)
* `kubectl expose deployment hello-node --type=LoadBalancer --port=8080`
  - kubectl can create its own service without a .yaml file, as specified here

### 5. Port forwarding (Usually unnecessary with minikube)
* `kubectl port-forward svc/[service] visit-port:declared-port`
* `kubectl port-forward deployment/[depl] from-port:to-port`
* `kubectl port-forward pods/[pod] 8080:32000`
  - Now your deployment is accessible at http://localhost:8080/

### 6. Expose service
* `minikube service pithy[-service]` 
  - minikube is a container that doesn't inherently expose ports without being told to
* `minikube service [service-name] —url`
  - specifies just the output url

### 7. HPA
* `kubectl apply -f pithy-hpa.yaml`
    - Need yaml for the Horizontal Pod Autoscaler. This will need scale (min/max) and the stats to scale around (can spec in many ways)
* `kubectl autoscale deployment [pithy-deployment] --cpu-percent=50 --min=1 --max=10`
  - Kubectl can create auto-scaling.  Enter the parameters specific to your use cases in the command above.

Minikube is a highly versatile tool that can provide you insights and access to different parts of your cluster.  We suggest reading the docs to better understand the breadth of possible commands you can use in minikube and kubectl to see the details of your cluster components.

(Best node->mk tutorial: https://theekshanawj.medium.com/kubernetes-deploying-a-nodejs-app-in-minikube-local-development-92df31e0b037)
