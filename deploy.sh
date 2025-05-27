#!/bin/bash

# Build the Docker image
docker build -t mqtt-dashboard .

# Load the image into MicroK8s
docker save mqtt-dashboard | microk8s ctr image import -

# Tag the image for MicroK8s
microk8s ctr image tag docker.io/library/mqtt-dashboard:latest localhost:32000/mqtt-dashboard:latest

# Apply Kubernetes manifests
microk8s kubectl apply -f k8s/deployment.yaml
microk8s kubectl apply -f k8s/service.yaml
microk8s kubectl apply -f k8s/ingress.yaml

echo "Deployment complete!"
echo "The dashboard should be available at http://<your-microk8s-ip>:30080"
