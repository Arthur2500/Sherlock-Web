[![Dev Docker Image CI](https://github.com/Arthur2500/Sherlock-Web/actions/workflows/docker-image-dev.yml/badge.svg)](https://github.com/Arthur2500/Sherlock-Web/actions/workflows/docker-image-dev.yml)
# Sherlock Web <img src="https://github.com/Arthur2500/Sherlock-Web/raw/dev/public/favicon.ico" alt="Icon" width="24"/>
A web interface for [Sherlock](https://github.com/sherlock-project/sherlock). All credits belong to them, this is just a simple frontend.

## Demo:
https://sherlock.ziemlich-schnell.de

## How to run:
### Use Prebuilt Image (Recommended)
```
docker run --name sherlock-web --env SECURITY=disabled -d -p 3000:3000 ghcr.io/arthur2500/sherlock-web:latest 
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
Sherlock
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
- `SECURITY: [enabled/disabled]`: Enable/Disable Security features such as Ratelimiting for API and Helmet header protection

## Screenshots
![Screenshot 2024-08-20 215648](https://github.com/user-attachments/assets/a2d7979e-2f71-4f3f-9063-57128690e62a)
