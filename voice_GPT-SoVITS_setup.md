# Arsip Setup GPT-SoVITS (Google Colab to AI Waifu)

Arsip eksperimen GPT-SoVITS yang tidak lagi dipakai aplikasi. Voice TTS aktif sekarang memakai Fish Audio.

## Package jika ingin mencoba lagi

Tambahkan client Gradio kembali ke aplikasi:

```bash
npm install @gradio/client
```

Environment Colab lama memakai `condacolab`, lalu `jinja2==3.1.4`, `gradio==4.43.0`, dan `starlette==0.37.2` seperti perintah di bawah.

Panduan melatih model suara Takanashi Hoshino melalui GPT-SoVITS WebUI di Google Colab lalu menghubungkannya ke AI Waifu.

## 1. Log Colab & Error Normal

Pesan berikut normal dan bukan kegagalan setup:

- `kernel ... restarted` / `AsyncIOLoopKernelRestarter`: Condacolab mereset Python environment setelah install.
- `Setting websocket_ping_timeout=30000`: Jupyter keep-alive log.
- `Debugger warning: It seems that frozen modules are being used`: Peringatan debugger bawaan Colab.
- `404 Not Found (/favicon.ico)`: Browser meminta favicon; server tetap aktif.

## 2. Persiapan Google Colab

### Set GPU

1. Pilih **Runtime** → **Change runtime type**.
2. Pilih **T4 GPU** → **Save**.
3. Jangan ganti runtime lagi setelah setup; isi `/content` akan reset.

### Setup environment

Jalankan dua cell ini terpisah.

**Cell 1 — install Conda:**

```python
%pip install -q condacolab
import condacolab
condacolab.install_from_url("https://repo.anaconda.com/archive/Anaconda3-2024.10-1-Linux-x86_64.sh")
```

Tunggu kernel restart otomatis, lalu jalankan cell berikutnya.

**Cell 2 — setup GPT-SoVITS:**

```python
!cd /content && bash setup.sh
```

Pesan `fatal: destination path 'GPT-SoVITS' already exists` aman bila repo sudah pernah di-clone.

### Mount Drive & salin dataset Hoshino

Upload audio Hoshino yang bersih (hanya Hoshino, tanpa karakter lain/BGM) ke `MyDrive/GPT-SoVITS/`.

```python
from google.colab import drive
drive.mount('/content/drive')

!mkdir -p /content/GPT-SoVITS/hoshino_raw
!cp "/content/drive/MyDrive/GPT-SoVITS/"*.mp3 /content/GPT-SoVITS/hoshino_raw/
!ls -la /content/GPT-SoVITS/hoshino_raw/
```

Gunakan kode Python di **notebook cell**. Jangan jalankan `from google.colab import drive` di Terminal bash.

### Jalankan WebUI

Jika WebUI terkena `TypeError: unhashable type: 'dict'`, stop proses lalu jalankan:

```python
!cd /content/GPT-SoVITS && source activate GPTSoVITS && pip install jinja2==3.1.4 gradio==4.43.0 starlette==0.37.2 && export is_share=True && python webui.py
```

Buka URL `https://xxxxx.gradio.live` dari output. URL share Gradio biasanya kedaluwarsa dalam 72 jam atau saat runtime mati.

## 3. Preprocessing Dataset (Tab `0-Fetch Datasets`)

### 0a — UVR5 (opsional)

Pakai hanya jika audio masih punya BGM atau noise berat. Untuk audio vokal bersih, lewati.

- Input: `/content/GPT-SoVITS/hoshino_raw`
- Output: `/content/GPT-SoVITS/output/uvr5_opt`

### 0b — Speech Slicing

- **Audio slicer input**: `/content/GPT-SoVITS/hoshino_raw`
- **Audio slicer output**: `/content/GPT-SoVITS/output/slicer_opt`
- Biarkan parameter threshold, interval, dan panjang default.
- Klik **Open Speech Slicing**.

Cek hasil:

```bash
find /content/GPT-SoVITS/output/slicer_opt -name "*.wav" | head
```

### 0c — Speech Recognition (ASR)

- **Input folder**: `/content/GPT-SoVITS/output/slicer_opt`
- **Output folder**: `output/asr_opt`
- **ASR model**: `Faster Whisper`
- **ASR model size**: `large`
- **ASR language**: `ja`
- **Computing precision**: `float16` untuk GPU T4; gunakan `float32` bila ada error precision.
- Klik **Open Speech Recognition**.

Output label biasanya:

```text
/content/GPT-SoVITS/output/asr_opt/slicer_opt.list
```

### 0d — Proofreading / Labeling

- **Label File Path**: `/content/GPT-SoVITS/output/asr_opt/slicer_opt.list`
- Klik **Open Audio Labeling WebUI**.
- Koreksi hasil transkrip Jepang bila keliru, lalu simpan.

## 4. Dataset Formatting & Training

Di tab training WebUI:

1. Isi nama eksperimen: `hoshino`.
2. Masukkan file label: `/content/GPT-SoVITS/output/asr_opt/slicer_opt.list`.
3. Masukkan folder audio: `/content/GPT-SoVITS/output/slicer_opt`.
4. Jalankan semua tahap dataset formatting (text/token, SSL feature, semantic feature) secara berurutan.
5. Train SoVITS: batch size `4`–`8`, epochs `8`–`15`.
6. Train GPT: batch size `4`–`8`, epochs sekitar `15`.

Simpan checkpoint model hasil training ke Google Drive sebelum runtime berakhir.

## 5. Hubungkan ke AI Waifu

1. Pastikan WebUI Gradio tetap berjalan.
2. Salin URL Gradio publik `https://xxxxx.gradio.live`.
3. Di AI Waifu, buka **Voice Settings** lewat icon speaker.
4. Aktifkan **Voice TTS** dan masukkan URL tersebut.
5. Isi **Reference audio path** dengan file `.wav` hasil slicing, misalnya:

```text
/content/GPT-SoVITS/output/slicer_opt/Hoshino_Lobby_4.ogg.mp3_0000000000_0000103360.wav
```

6. Isi **Reference audio transcript** dengan dialog Jepang yang benar untuk audio itu.
7. Set prompt language dan target language ke `Japanese`.
8. Klik **Test**, lalu mulai chat.

Untuk endpoint inference GPT-SoVITS, URL Gradio WebUI sudah cukup. Tidak perlu membuat tunnel tambahan selama URL `gradio.live` aktif.
