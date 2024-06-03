FROM node:16

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

RUN npm ci

RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

COPY . /usr/src/app

CMD ["npm", "start"]