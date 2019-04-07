FROM node:10

RUN apt-get update && apt-get -y install cron

WORKDIR /var/www/

COPY package-lock.json package-lock.json
COPY package.json package.json
RUN npm ci --only=production

COPY . .

RUN crontab ./crons/updater.cron

EXPOSE 7000

CMD cron && npm run serve-production
