#!/bin/bash

# Konfigurasi
REMOTE_USER="duwiarsana"
REMOTE_HOST="41.216.191.200"

# Install Docker dan Docker Compose di server
info "Menginstal Docker dan dependensi..."
ssh ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'
  # Update package list
  sudo apt-get update
  
  # Install paket yang diperlukan
  sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

  # Tambahkan kunci GPG Docker
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

  # Tambahkan repository Docker
  echo \
    "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

  # Install Docker Engine
  sudo apt-get update
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io

  # Install Docker Compose
  sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose

  # Tambahkan pengguna ke grup docker
  sudo usermod -aG docker $USER
  newgrp docker

  # Verifikasi instalasi
  docker --version
  docker-compose --version
ENDSSH

echo -e "\n\033[1;32m[✓] Instalasi selesai!\033[0m"
echo "Sekarang Anda bisa menjalankan deploy-remote.sh untuk mendeploy aplikasi"
