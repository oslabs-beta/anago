# EKS Setup

## Pre-reqs

- AWS CLI
- Minikube/kubectl
- eksctl
- docker

## Log in and Authenticate

1. Log in to aws.amazon.com as IAM user with Account ID: 180202761917, user: **\***, pwd: **\***!
2. From command line, run ‘aws configure’ and enter AuthID and AuthSecret
   AuthID: **\***
   AuthSecret: **\***
3. Entering your credentials automatically creates the secret file: ~/.aws/config.  Find the file on your local machine by typing 'command-shift-g' within your Finder.  You have to change the secret file to the following:

> [default]
> region = us-east-2
>
> [profile schlep]
> region = us-east-2
> output = json
>
> [profile S3FullAccess]
> role_arn = arn:aws:iam::180202761917:role/Admin-Kub
> source_profile = schlep
> region = us-east-2

Note: (Notes on the importance of the region, etc.)

## eksctl setup

1. `eksctl create cluster --name [test-cluster] --region us-east-2 —-node-type [t2.micro] --nodes [2]`
2. eksctl will add a config file in ~/.kube that directs local kubectl commands to your EKS instance.
3. To access elsewhere, run this code:
   `aws eks update-kubeconfig --region us-east-2 name [test-cluster]`

## Loading the image to ECR

1. Create an image repo in ECR, if there isn’t one
2. the software folder should have a Dockerfile
3. From ECR’s image repo (must be in the right region), click “View Push Commands”
4. Run these exact commands in order in order to hand amazon auth info to docker (expires after 12 hours), build and tag a docker image, and push it up to amazon
WHAT EXACT COMMANDS?!
   
5. NOTE: If using an M1 Mac, you MUST modify the docker build command in order to correct the build platform:
   `docker buildx build --platform linux/amd64 -t [pithy] .`

## Deployment + Services

1. Use kubectl to deploy deployment(+pods) and services as usual (see Kubernetes Deployment doc), using the ECR image link. For example:
   `kubectl apply -f aws-pithy.yaml` (modify aws-pithy image uri) -or-
   `kubectl create deployment [Depl-name] --image=[180202761917.dkr.ecr.us-east-2.amazonaws.com/pithy]`
2. `kubectl get svc` should surface the Service’s external IP, now accessible

## Prometheus + grafana
