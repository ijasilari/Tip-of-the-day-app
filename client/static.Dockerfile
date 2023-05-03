FROM node:alpine as build-stage

WORKDIR /opt/client

COPY package*.json /opt/client/

RUN npm install

COPY ./ /opt/client/

RUN npm run build

FROM nginx:stable-alpine as production-stage

COPY  --from=build-stage /opt/client/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]