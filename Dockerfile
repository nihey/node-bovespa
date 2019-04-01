FROM node:10

WORKDIR /var/www/

COPY . .
RUN npm ci --only=production

EXPOSE 7000

CMD [ "npm", "run", "serve-production" ]
