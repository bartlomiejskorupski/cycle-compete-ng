FROM node:18.20-alpine AS build_stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build:docker

FROM nginx:1.27.3-alpine

WORKDIR /home

COPY --from=build_stage /app/dist/cycle-compete-ng /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY ENTRYPOINT.sh ENTRYPOINT.sh
RUN sed -i 's/\r$//g' ENTRYPOINT.sh
RUN chmod +x ENTRYPOINT.sh

EXPOSE 80

CMD ["sh", "/home/ENTRYPOINT.sh"]
