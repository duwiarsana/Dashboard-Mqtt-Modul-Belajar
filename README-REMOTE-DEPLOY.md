# Panduan Deployment Remote ke MicroK8s

Dokumen ini menjelaskan cara melakukan deployment MQTT Dashboard ke server remote yang menjalankan MicroK8s.

## Prasyarat

1. Server remote dengan MicroK8s yang sudah terinstall dan berjalan
2. Akses SSH ke server remote dengan hak akses sudo
3. Docker terinstall di mesin lokal
4. Koneksi internet yang stabil

## Langkah-langkah Deployment

### 1. Konfigurasi Awal

Edit file `remote-deploy.sh` dan sesuaikan variabel berikut:

```bash
REMOTE_USER="username_anda"          # Username untuk SSH
REMOTE_HOST="alamat_ip_server"        # Alamat IP atau hostname server
REMOTE_DIR="/path/ke/direktori"      # Direktori tujuan di server
```

### 2. Buat Direktori di Server Remote

Sebelum melakukan deployment, pastikan direktori tujuan sudah ada di server remote:

```bash
ssh ${REMOTE_USER}@${REMOTE_HOST} "mkdir -p ${REMOTE_DIR}"
```

### 3. Berikan Izin Eksekusi ke Script

```bash
chmod +x remote-deploy.sh
```

### 4. Jalankan Deployment

```bash
./remote-deploy.sh
```

### 5. Verifikasi Deployment

Setelah deployment selesai, verifikasi dengan perintah berikut di server remote:

```bash
# Cek status pods
microk8s kubectl get pods -n default

# Cek services
microk8s kubectl get svc

# Cek logs (ganti <pod-name> dengan nama pod yang sesuai)
microk8s kubectl logs <pod-name>
```

## Troubleshooting

1. **Gagal mengunggah file**: Pastikan direktori tujuan memiliki izin yang cukup
2. **Gagal load image**: Pastikan MicroK8s berjalan dengan baik di server remote
3. **Port tidak terbuka**: Pastikan port 30080 tidak digunakan oleh layanan lain
4. **Gagal koneksi MQTT**: Periksa konfigurasi MQTT broker di `src/config/mqtt.ts`

## Konfigurasi Tambahan

### Menggunakan Domain Khusus

Jika Anda ingin menggunakan domain khusus, edit file `k8s/ingress.yaml` dan sesuaikan dengan domain Anda.

### Skalabilitas

Untuk menyesuaikan jumlah replika, edit file `k8s/deployment.yaml` pada bagian `replicas:`.

## Kontak

Jika mengalami masalah, silakan buat issue baru di repositori ini.
