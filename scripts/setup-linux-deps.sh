#!/usr/bin/env bash
# Install system deps for building the MeshForge Tauri app on Ubuntu/Debian.
# - GTK/WebKit: required by Tauri for the Linux webview
# - pkg-config, libudev-dev: required by serialport (grbl-rs serial feature)
set -e
echo "Installing MeshForge Tauri app dependencies (GTK/WebKit + serial)..."
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  pkg-config \
  libudev-dev
echo "Done. Run: npm run dev"
