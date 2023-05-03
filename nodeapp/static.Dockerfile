FROM node:lts-slim

WORKDIR /opt/api

COPY . /opt/api

RUN cd /opt/api && npm install

EXPOSE 3000

CMD ["npm","run","start"]