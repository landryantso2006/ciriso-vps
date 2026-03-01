# Utiliser Ubuntu comme base
FROM ubuntu:20.04

# Éviter les prompts interactifs
ENV DEBIAN_FRONTEND=noninteractive

# Mettre à jour et installer les paquets nécessaires
RUN apt-get update && apt-get install -y \
    xfce4 \
    xfce4-goodies \
    x11vnc \
    xvfb \
    wget \
    curl \
    net-tools \
    supervisor \
    novnc \
    websockify \
    python3 \
    google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Créer un utilisateur non-root
RUN useradd -m ubuntu
USER ubuntu
WORKDIR /home/ubuntu

# Copier ton extension Chrome
COPY manifest.json /home/ubuntu/extension/
COPY js/background.js /home/ubuntu/extension/
COPY js/content_script_ca.js /home/ubuntu/extension/

# Configurer noVNC
EXPOSE 8080
CMD ["bash", "-c", "xvfb :1 -screen 0 1024x768x16 & x11vnc -display :1 -nopw -listen localhost -xkb & websockify --web=/usr/share/novnc/ 8080 localhost:5900"]
