#!/bin/sh

cd /usr/share/nginx/html

apk update && apk add git
git clone https://github.com/felipelinczuk/formAPP /usr/share/nginx/html/formAPP/

cat >/etc/nginx/conf.d/default.conf <<EOF
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html/formAPP;
        index index.html;
    }
}
EOF

nginx -t

nginx -g 'daemon off;'

