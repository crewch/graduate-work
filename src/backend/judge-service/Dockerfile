FROM node:22.14.0

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn

COPY . .

RUN yarn prisma generate

RUN yarn build

CMD ["yarn", "start:prod"]