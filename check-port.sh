#!/bin/bash

# Konfigurasi
REMOTE_USER="duwiarsana"
REMOTE_HOST="41.216.191.200"
PORT_TO_CHECK=80

# Fungsi untuk menampilkan pesan
info() {
  echo -e "\033[1;34m[i] $1\033[0m"
}

error() {
  echo -e "\033[1;31m[!] $1\033[0m"
}

success() {
  echo -e "\033[1;32m[✓] $1\033[0m"
}

info "Memeriksa ketersediaan port $PORT_TO_CHECK di $REMOTE_HOST..."

# Periksa apakah port sedang digunakan
if ssh $REMOTE_USER@$REMOTE_HOST "netstat -tuln | grep -q ':$PORT_TO_CHECK '"; then
  error "Port $PORT_TO_CHECK sedang digunakan oleh layanan lain di $REMOTE_HOST"
  
  # Dapatkan informasi proses yang menggunakan port 80
  info "Proses yang menggunakan port $PORT_TO_CHECK:"
  ssh $REMOTE_USER@$REMOTE_HOST "sudo lsof -i :$PORT_TO_CHECK"
  
  echo -e "\nPilihan:"
  echo "1. Hentikan layanan yang menggunakan port $PORT_TO_CHECK"
  echo "2. Gunakan port lain"
  echo "3. Batalkan"
  
  read -p "Pilihan Anda (1/2/3): " choice
  
  case $choice in
    1)
      info "Menghentikan layanan yang menggunakan port $PORT_TO_CHECK..."
      ssh $REMOTE_USER@$REMOTE_HOST "sudo systemctl stop nginx"
      ssh $REMOTE_USER@$REMOTE_HOST "sudo systemctl disable nginx"
      ssh $REMOTE_USER@$REMOTE_HOST "sudo pkill -f 'nginx'" || true
      success "Layanan di port $PORT_TO_CHECK telah dihentikan"
      ;;
    2)
      read -p "Masukkan port alternatif: " NEW_PORT
      sed -i '' "s/      - \"80:80\"/      - \"$NEW_PORT:80\"/" docker-compose.yml
      success "Menggunakan port $NEW_PORT sebagai gantinya"
      ;;
    *)
      error "Deployment dibatalkan"
      exit 1
      ;;
  esac
else
  success "Port $PORT_TO_CHECK tersedia"
fi
