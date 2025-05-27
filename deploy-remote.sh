#!/bin/bash

# Konfigurasi
REMOTE_USER="duwiarsana"
REMOTE_HOST="41.216.191.200"
REMOTE_DIR="/home/duwiarsana/mqtt-dashboard"
REMOTE_PORT="80"

# Warna untuk output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fungsi untuk menampilkan pesan
info() {
  echo -e "${BLUE}[i] $1${NC}"
}

success() {
  echo -e "${GREEN}[✓] $1${NC}"
}

error() {
  echo -e "${RED}[!] $1${NC}"
}

# Periksa koneksi ke server
info "Memeriksa koneksi ke server..."
if ! ssh -q ${REMOTE_USER}@${REMOTE_HOST} exit; then
  error "Tidak dapat terhubung ke server"
  exit 1
fi

# Buat direktori di server
info "Membuat direktori di server..."
ssh ${REMOTE_USER}@${REMOTE_HOST} "mkdir -p ${REMOTE_DIR}" || {
  error "Gagal membuat direktori di server"
  exit 1
}

# Kirim file yang diperlukan ke server
info "Mengirim file ke server..."
scp -r \
  Dockerfile \
  docker-compose.yml \
  nginx.conf \
  ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/ || {
  error "Gagal mengirim file ke server"
  exit 1
}

# Build dan jalankan di server
info "Membangun dan menjalankan container di server..."
ssh ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'
  set -e  # Exit on error
  
  # Install Docker jika belum terpasang
  if ! command -v docker &> /dev/null; then
    echo "Menginstal Docker..."
    sudo apt-get update
    sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    
    # Tambahkan user ke grup docker
    sudo usermod -aG docker $USER
    
    # Load group baru tanpa perlu logout
    exec sg docker newgrp $(id -gn)
    
    # Tunggu sejenak untuk memastikan group sudah terupdate
    sleep 5
  fi

  # Install Docker Compose jika belum terpasang
  if ! command -v docker-compose &> /dev/null; then
    echo "Menginstal Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
  fi
  
  # Pastikan docker service berjalan
  sudo systemctl enable docker
  sudo systemctl start docker

  cd /home/duwiarsana/mqtt-dashboard
  
  echo "Menghentikan container yang sedang berjalan..."
  sudo docker-compose down || true
  
  echo "Menghapus image lama jika ada..."
  sudo docker rmi mqtt-dashboard:latest || true
  
  echo "Membangun image baru..."
  sudo docker build -t mqtt-dashboard:latest .
  
  echo "Menjalankan container..."
  sudo docker-compose up -d
  
  echo -e "\nStatus container:"
  docker ps | grep mqtt-dashboard
  
  echo -e "\nLog terakhir (10 baris):"
  docker-compose logs --tail=10
  
  echo -e "\nMemeriksa koneksi ke aplikasi..."
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:80 | grep -q "200\|301\|302"; then
    echo -e "\n✅ Aplikasi berjalan dengan baik"
  else
    echo -e "\n❌ Gagal terhubung ke aplikasi"
    docker-compose logs
    exit 1
  fi
ENDSSH

if [ $? -eq 0 ]; then
  success "Deployment berhasil!"
  echo -e "\n🌐 Aplikasi dapat diakses di: http://${REMOTE_HOST}"
  echo -e "📝 Untuk melihat log: ssh ${REMOTE_USER}@${REMOTE_HOST} 'cd ${REMOTE_DIR} && docker-compose logs -f'"
  echo -e "🛑 Untuk menghentikan: ssh ${REMOTE_USER}@${REMOTE_HOST} 'cd ${REMOTE_DIR} && docker-compose down'"
else
  error "Deployment gagal!"
  exit 1
fi
