[![Docker Image CI](https://github.com/Arthur2500/Sherlock-Web/actions/workflows/docker-image.yml/badge.svg)](https://github.com/Arthur2500/Sherlock-Web/actions/workflows/docker-image.yml)
# Sherlock Web <img src="https://github.com/Arthur2500/Sherlock-Web/raw/main/public/favicon.ico" alt="Icon" width="24"/>
A web interface for [Sherlock](https://github.com/sherlock-project/sherlock). All credits belong to them, this is just a simple frontend.

## Demo:
https://sherlock.ziemlich-schnell.de

## How to run:
### Use Prebuilt Image (Recommended)
```
docker run --name sherlock-web -p 3000:3000 -e NODE_ENV=production -e SECURITY=enabled --restart unless-stopped ghcr.io/arthur2500/sherlock-web:latest
```
or
```
mkdir Sherlock-Web &&
cd Sherlock-Web &&
wget https://raw.githubusercontent.com/Arthur2500/Sherlock-Web/main/docker-compose.yml &&
docker-compose up -d
```

### Build Docker Image Locally
```
git clone https://github.com/Arthur2500/Sherlock-Web.git &&
docker-compose -f docker-compose.local.yml up -d --build
```

### Run without Docker
Requirements:
```
Node.js >= 16
Sherlock (https://github.com/sherlock-project/sherlock)
```

Clone Repository
```
git clone https://github.com/Arthur2500/Sherlock-Web.git
```

Install dependencies
```
npm install
```

Run main.js
```
node server.js
```

For improved security, set environment variable SECURITY=enabled if exclusively accessed via Cloudflare Tunnel or localhost
```
SECURITY=enabled node main.js
```

## Configuration
`docker-compose.yml` Environment Settings:
- `SECURITY: [enabled/disabled]`: Enable/Disable Security features such as Helmet header protection

## Screenshots
<img width="1440" alt="Bildschirmfoto 2024-09-16 um 23 10 28" src="https://github.com/user-attachments/assets/449a29ab-0c26-4f1d-a8e4-b6d2775109fe">
<img width="1440" alt="Bildschirmfoto 2024-09-16 um 23 11 15" src="https://github.com/user-attachments/assets/8696afa3-3b7b-48ec-b65e-e23c77d91af5">
<img width="1440" alt="Bildschirmfoto 2024-09-16 um 23 13 12" src="https://github.com/user-attachments/assets/ecb33b61-2f30-4a00-8fc5-d50442ff8d6a">
<img width="1440" alt="Bildschirmfoto 2024-09-16 um 23 12 55" src="https://github.com/user-attachments/assets/21fa7cfb-ad98-4435-b582-cf124114b953">
