rebuild:
	docker-compose build
	docker-compose up -d --remove-orphans

reload:
	docker-compose up -d

build-db:
	docker-compose exec -e NODE_ENV=production bovespa npm run build

update-db:
	docker-compose exec -e NODE_ENV=production bovespa node bin/build.js --update

remote-build-db:
	ssh maridia "cd /var/www/bovespa && make build-db"

remote-update-db:
	ssh maridia "cd /var/www/bovespa && make update-db"

deploy:
	rsync -azv . maridia:/var/www/bovespa --exclude node_modules \
		--exclude .git --exclude _downloaded
	ssh maridia "cd /var/www/bovespa && make rebuild"
