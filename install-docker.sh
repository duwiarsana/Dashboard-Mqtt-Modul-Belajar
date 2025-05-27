#!/bin/bash

# Konfigurasi
REMOTE_USER="duwiarsana"
REMOTE_HOST="41.216.191.200"

# Fungsi untuk menampilkan pesan
info() {
  echo -e "\033[1;34m[i] $1\033[0m"
}

success() {
  echo -e "\033[1;32m[✓] $1\033[0m"
}

error() {
  echo -e "\033[1;31m[!] $1\033[0m"
}

# Periksa koneksi ke server
info "Memeriksa koneksi ke server..."
if ! ssh -t ${REMOTE_USER}@${REMOTE_HOST} exit; then
  error "Tidak dapat terhubung ke server"
  exit 1
fi

info "Menginstal Docker di server..."

# Jalankan perintah instalasi Docker
ssh -t ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'
  # Update package list
  echo "Mengupdate daftar paket..."
  sudo apt-get update
  
  # Install paket yang diperlukan
  echo "Menginstal dependensi..."
  sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
  
  # Tambahkan kunci GPG Docker
  echo "Menambahkan kunci GPG Docker..."
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
  
  # Tambahkan repository Docker
  echo "Menambahkan repository Docker..."
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  
  # Update package list lagi
  sudo apt-get update
  
  # Install Docker
  echo "Menginstal Docker..."
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io
  
  # Mulai dan aktifkan Docker
  echo "Menjalankan Docker service..."
  sudo systemctl enable docker
  sudo systemctl start docker
  
  # Tambahkan user ke grup docker
  echo "Menambahkan user ke grup docker..."
  sudo usermod -aG docker $USER
  
  # Install Docker Compose
  echo "Menginstal Docker Compose..."
  sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  
  # Verifikasi instalasi
  echo -e "\nVerifikasi instalasi:"
  docker --version
  docker-compose --version
  
  echo -e "\nInstalasi selesai! Silakan logout dan login kembali, atau jalankan perintah berikut:"
  echo "  newgrp docker"
  echo "Kemudian jalankan skrip deploy-remote.sh"
ENDSSH

if [ $? -eq 0 ]; then
  success "Instalasi Docker selesai!"
  echo -e "\nLangkah selanjutnya:"
  echo "1. Buka terminal baru"
  echo "2. SSH ke server: ssh ${REMOTE_USER}@${REMOTE_HOST}"
  echo "3. Jalankan: newgrp docker"
  echo "4. Kemudian jalankan: ./deploy-remote.sh"
else
  error "Terjadi kesalahan saat menginstal Docker"
  exit 1
fi
