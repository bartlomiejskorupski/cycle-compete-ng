#!/bin/bash

# Replace environment variables in application files
for ext in js html; do
  for file in /usr/share/nginx/html/*.$ext; do
    [ -e "$file" ] || continue
    sed -i "s|#{API_URL}|${API_URL}|g" "$file"
  done
done

# Start NGINX
nginx -g 'daemon off;'