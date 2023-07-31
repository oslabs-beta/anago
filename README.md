## Minikube Deployment Steps
There are lots of ways to do different things. 2-6 have multiple options flagged with '*'.   
Indented lines explain what's happening on this code   
'Pithy' is the placeholder server I made.   
  
### 1. Build docker image in minikube env (and verify)   
1a. eval $(minikube docker-env)    
  - Change execution / output context to inside of the minikube container, so the image is available   
1b. docker build -t [Image-Name] .   
  - Requires a Dockerfile, and outputs a Docker image   
[1c]. docker ssh   
  - Ssh into docker, in order to...   
[1d]. docker images      
  - Check local image directory to ensure your custom image is available   

### 2. Fire up depl pod somehow
* kubectl apply -f pithy.yaml
  - Launch deployment from a yaml file with image available (needs image-pull-policy:OnDemand or Never)
* kubectl run [depl-name] --image=[Image-Name] --image-pull-policy=Never
  - Run the deployment with a target image. image-pull-policy loks local, instead of fetching
* kubectl create deployment [Depl-name] --image=[Image-Name]

### 3. Fire up service (not working)
* kubectl apply -f pithy-service.yaml
  - spec.selector.app (in service) must point to spec.containers.name (in the deployment)
* kubectl expose deployment hello-node --type=LoadBalancer --port=8080
  - kubectl can create its own service without a .yaml file, as specified here

### 4. Port forwarding (Usually unnecessary)
* kubectl port-forward svc/[service] visit-port:declared-port
* kubectl port-forward deployment/[depl] from-port:to-port
* kubectl port-forward pods/[pod] 8080:32000

### 5. Expose service
* minikube service pithy[-service]
  - minikube is a container that doesn't inherently expose ports without being told to
* minikube service [service-name] —url
  - specifies just the output url

### 6. HPA
* kubectl apply -f pithy-hpa.yaml
    - Need yaml for the Horizontal Pod Autoscaler. This will need scale (min/max) and the stats to scale around (can spec in many ways)
* kubectl autoscale deployment [pithy-deployment] --cpu-percent=50 --min=1 --max=10
  - Kubectl can create auto-scaling

(Best node->mk tutorial: https://theekshanawj.medium.com/kubernetes-deploying-a-nodejs-app-in-minikube-local-development-92df31e0b037)
