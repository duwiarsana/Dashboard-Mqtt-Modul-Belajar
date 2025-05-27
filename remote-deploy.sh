#!/bin/bash

# Konfigurasi SSH
REMOTE_USER="duwiarsana"
REMOTE_HOST="41.216.191.200"
REMOTE_DIR="/home/duwiarsana/apps/mqtt-dashboard"

# Fungsi untuk menampilkan pesan
info() {
    echo -e "\033[1;34m[INFO]\033[0m $1"
}

error() {
    echo -e "\033[1;31m[ERROR]\033[0m $1"
    exit 1
}

# Cek apakah Docker berjalan
info "Memeriksa Docker..."
if ! docker info > /dev/null 2>&1; then
    error "Docker daemon tidak berjalan. Silakan jalankan Docker Desktop terlebih dahulu."
fi

# 1. Build Docker image
info "1. Membangun Docker image..."
docker build -t mqtt-dashboard . || error "Gagal build Docker image"

# 2. Simpan image ke file tar
info "2. Menyimpan Docker image..."
docker save mqtt-dashboard -o mqtt-dashboard.tar || error "Gagal menyimpan image"

# 3. Upload file ke server remote
info "3. Mengunggah file ke server remote..."

# Buat direktori remote
info "Membuat direktori remote..."
ssh ${REMOTE_USER}@${REMOTE_HOST} "mkdir -p ${REMOTE_DIR}/k8s" || error "Gagal membuat direktori remote"

# Upload file
info "Mengunggah file..."
scp mqtt-dashboard.tar ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/ || error "Gagal upload file tar"
scp -r k8s/* ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/k8s/ || error "Gagal upload file k8s"

# 4. Eksekusi perintah di server remote
info "4. Menjalankan deployment di server remote..."

cat << 'EOF' | ssh -t ${REMOTE_USER}@${REMOTE_HOST} "bash -s"
  cd ${REMOTE_DIR}
  
  echo 'Memuat Docker image ke MicroK8s...'
  sudo microk8s ctr image import mqtt-dashboard.tar || { echo 'Gagal memuat image ke MicroK8s'; exit 1; }
  
  echo 'Memberi tag pada image...'
  sudo microk8s ctr image tag docker.io/library/mqtt-dashboard:latest localhost:32000/mqtt-dashboard:latest || { echo 'Gagal menandai image'; exit 1; }
  
  echo 'Menerapkan konfigurasi Kubernetes...'
  sudo microk8s kubectl apply -f k8s/deployment.yaml || { echo 'Gagal menerapkan deployment'; exit 1; }
  sudo microk8s kubectl apply -f k8s/service.yaml || { echo 'Gagal menerapkan service'; exit 1; }
  sudo microk8s kubectl apply -f k8s/ingress.yaml || { echo 'Gagal menerapkan ingress'; exit 1; }
  
  echo 'Membersihkan file sementara...'
  rm -f mqtt-dashboard.tar
  
  echo 'Mengambil URL akses...'
  echo 'Dashboard dapat diakses di: http://41.216.191.200:30080'
EOF

if [ $? -ne 0 ]; then
  error "Gagal menjalankan perintah di server remote"
fi
  sudo microk8s kubectl get ingress
"

# 5. Cleanup lokal
info "5. Membersihkan file lokal..."
rm -f mqtt-dashboard.tar

info "=== PROSES SELESAI ==="
info "Dashboard seharusnya sudah bisa diakses di: http://${REMOTE_HOST}:30080"
