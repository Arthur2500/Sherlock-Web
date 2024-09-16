# Verwende das Node-Image als Basis
FROM node:22-bookworm

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y pipx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN pipx install sherlock-project

ENV PATH="/root/.local/bin:${PATH}"

# Arbeitsverzeichnis im Container festlegen
WORKDIR /usr/src/app

# Kopiere die package.json und package-lock.json (falls vorhanden)
COPY package*.json ./

# Installiere die Abhängigkeiten
RUN npm install --omit=dev

# Kopiere den Rest des Projekts
COPY . .

# Exponiere den Port 3000 für den Container
EXPOSE 3000

# Start des Servers
CMD ["npm", "start"]
