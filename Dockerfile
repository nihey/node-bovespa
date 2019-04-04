FROM node:10

WORKDIR /var/www/

COPY package-lock.json package-lock.json
COPY package.json package.json
RUN npm ci --only=production

COPY . .

EXPOSE 7000

CMD [ "npm", "run", "serve-production" ]
