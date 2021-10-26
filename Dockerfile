# base image
FROM node:12.14.1-alpine as build

# set working directory
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install --silent
RUN npm install react-scripts@3.4.0 -g --silent

# set env variables
ARG REACT_APP_ENV
ENV REACT_APP_ENV=$REACT_APP_ENV

ARG REACT_APP_API
ENV REACT_APP_API=$REACT_APP_API

ARG REACT_APP_DOMAIN
ENV REACT_APP_DOMAIN=$REACT_APP_DOMAIN

ARG REACT_APP_BETA_DOMAIN
ENV REACT_APP_BETA_DOMAIN=$REACT_APP_BETA_DOMAIN

ARG REACT_APP_DATA
ENV REACT_APP_DATA=$REACT_APP_DATA

ARG REACT_APP_SPARQL
ENV REACT_APP_SPARQL=$REACT_APP_SPARQL

ARG REACT_APP_BASENAME
ENV REACT_APP_BASENAME=$REACT_APP_BASENAME

ENV PUBLIC_URL=$REACT_APP_DOMAIN

ARG GENERATE_SOURCEMAP_FILES
ENV GENERATE_SOURCEMAP=$GENERATE_SOURCEMAP_FILES 

ARG PORT

COPY . /app
RUN npm run build

# production environment
FROM nginx:1.16.1-alpine
COPY --from=build /app/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE $PORT
CMD ["nginx", "-g", "daemon off;"]