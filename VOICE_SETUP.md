# Panduan Lengkap Voice Setup GPT-SoVITS (Google Colab)

Panduan praktis langkah demi langkah melatih model suara Takanashi Hoshino menggunakan GPT-SoVITS WebUI di Google Colab dan menghubungkannya ke aplikasi aiWaifu.

---

## Ringkasan Error Log Colab (Jupyter Server / Kernel)

Pesan log berikut adalah **informasi normal**, bukan error fatal:
- `kernel ... restarted` / `AsyncIOLoopKernelRestarter`: Terjadi otomatis saat install conda/condacolab selesai mereset environment runtime Python.
- `Setting websocket_ping_timeout=30000`: Log keep-alive internal Jupyter Server Colab.
- `Debugger warning: It seems that frozen modules are being used`: Peringatan debugger Python default Colab, abaikan saja.

---

## Persiapan Awal di Google Colab

### 1. Set Hardware GPU
1. Klik menu **Runtime** → **Change runtime type**.
2. Pilih **T4 GPU** → klik **Save**.

### 2. Jalankan Environment Setup (Cell 1 & 2 terpisah)

**Cell 1 (Install Conda):**
```python
%pip install -q condacolab
import condacolab
condacolab.install_from_url("https://repo.anaconda.com/archive/Anaconda3-2024.10-1-Linux-x86_64.sh")
```
*(Tunggu sampai kernel restart otomatis selesai)*

**Cell 2 (Clone Repo & Setup Script):**
```python
!cd /content && bash setup.sh
```

### 3. Mount Google Drive & Copy File Suara Hoshino
Pastikan file audio `.mp3` Hoshino sudah diupload ke Google Drive.

```python
from google.colab import drive
drive.mount('/content/drive')

!mkdir -p /content/GPT-SoVITS/hoshino_raw
!cp "/content/drive/MyDrive/GPT-SoVITS/"*.mp3 /content/GPT-SoVITS/hoshino_raw/
!ls -la /content/GPT-SoVITS/hoshino_raw/
```

### 4. Menjalankan WebUI
Jika terjadi error `TypeError: unhashable type: 'dict'` pada Jinja2/Starlette, pastikan versi Gradio terkunci stabil:

```python
!cd /content/GPT-SoVITS && source activate GPTSoVITS && pip install jinja2==3.1.4 gradio==4.43.0 starlette==0.37.2 && export is_share=True && python webui.py
```

Buka URL publik Gradio yang muncul di output: `https://xxxx.gradio.live`.

---

## Panduan Pengisian Form WebUI (Step by Step: 0a s/d 0d)

Buka tab **0-Fetch Datasets** pada WebUI:

### 0a-UVR5 WebUI (Pemisah Vokal / Background Music)
*Catatan: Jika file MP3 kamu sudah vokal bersih tanpa BGM/lagu latar, **lewati step 0a**.*
- **Input folder**: `/content/GPT-SoVITS/hoshino_raw`
- **Output folder**: `/content/GPT-SoVITS/output/uvr5_opt`
- **Model**: `HP5_only_vocals`
- Klik **Start Vocal Separation**.

---

### 0b-Speech Slicing Tool (Pemotong Potongan Suara)
Memotong audio panjang menjadi segmen 4-10 detik.

- **Audio slicer input (file or folder)**:
  `/content/GPT-SoVITS/hoshino_raw` *(atau `/content/GPT-SoVITS/output/uvr5_opt/vocal` jika lewat UVR5)*
- **Audio slicer output folder**:
  `/content/GPT-SoVITS/output/slicer_opt`
- **Noise gate threshold**: `-34` (default)
- **min_length**: `4000` (default)
- **Minimum interval for audio cutting**: `300` (default)
- **hop_size**: `10` (default)
- **Maximum length for silence to be kept**: `500` (default)
- Klik tombol oranye: **Open Speech Slicing / Start Slicing**.

---

### 0c-Speech Recognition Tool (ASR / Auto Transkrip)
Mentranskrip rekaman suara Jepang Hoshino ke teks secara otomatis.

- **Input folder path**:
  `/content/GPT-SoVITS/output/slicer_opt`
- **Output folder path**:
  `output/asr_opt` *(atau path absolut: `/content/GPT-SoVITS/output/asr_opt`)*
- **ASR model**: `Faster Whisper` *(atau `Fun-ASR-Nano`)*
- **ASR model size**: `large`
- **ASR language**: `ja` *(Japanese)*
- **Computing precision**: `float32` *(atau `float16` di GPU)*
- Klik tombol oranye: **Open Speech Recognition**.
- File list transkrip akan dihasilkan di `/content/GPT-SoVITS/output/asr_opt/slicer_opt.list`.

---

### 0d-Speech-to-Text Proofreading Tool (Verifikasi Label Teks)
- **Label File Path (with file extension \*.list)**:
  `/content/GPT-SoVITS/output/asr_opt/slicer_opt.list`
- Klik **Open Audio Labeling WebUI**.
- Kamu bisa mengecek atau mengedit transkrip jika ada lafal yang salah, lalu klik tombol **Save File**.

---

## Step 1: Format Dataset & Training Model

Masuk ke tab **1-GPT-SOVITS-TTS**:

### 1-Dataset Formatting (1A)
- **Experiment/Model Name**: `hoshino`
- **Text labeling file (.list)**:
  `/content/GPT-SoVITS/output/asr_opt/slicer_opt.list`
- **Audio folder**:
  `/content/GPT-SoVITS/output/slicer_opt`
- Jalankan step **1A-Dataset Formatting** berurutan (Text tokenization, SSL feature extraction, Semantic feature extraction).

### 2-SoVITS Training (1B)
- **Batch size**: `4` s/d `8` (sesuaikan VRAM T4 16GB)
- **Total epochs**: `8` s/d `15`
- Klik **Start SoVITS Training**.

### 3-GPT Training (1C)
- **Batch size**: `4` s/d `8`
- **Total epochs**: `15`
- Klik **Start GPT Training**.

---

## Step 2: Testing & Sambungkan ke aiWaifu

1. Di tab **1-GPT-SOVITS-TTS** (Inference):
   - Masukkan checkpoint model SoVITS & GPT yang baru selesai dilatih.
   - Pilih satu potongan audio reference terbaik (3-6 detik) dari folder `slicer_opt` beserta teks Jepangnya.
2. Buka aplikasi aiWaifu di browser lokal (`http://localhost:3000`).
3. Hover ke sisi kiri layar → klik icon **Speaker** (Voice Settings).
4. Aktifkan toggle **Voice TTS**.
5. Masukkan URL Gradio publik Colab (`https://xxxx.gradio.live`).
6. Klik **Test** (akan muncul status `Connected` berwarna hijau).
7. Mulai obrolan dengan Hoshino!
