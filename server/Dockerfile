FROM node:16

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

RUN npm ci

COPY . /usr/src/app

EXPOSE 5000

CMD ["npm", "start"]