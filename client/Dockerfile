FROM node:alpine as build-stage

WORKDIR /opt/client

COPY package*.json /opt/client/

RUN npm install --force

COPY ./ /opt/client/

EXPOSE 80

CMD ["npm", "start"]
