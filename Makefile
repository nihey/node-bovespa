rebuild:
	docker-compose build bovespa
	docker-compose up -d

reload:
	docker-compose up -d

build-db:
	docker-compose run -e NODE_ENV=production bovespa npm run build

remote-build-db:
	ssh maridia "cd /var/www/bovespa && make build-db"

deploy:
	rsync -azv . maridia:/var/www/bovespa --exclude node_modules \
		--exclude .git --exclude _downloaded
	ssh maridia "cd /var/www/bovespa && make rebuild"
