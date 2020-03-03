```
git clone https://github.com/tomopongrac/flight-search.git
cd flight-search
composer install
```
Connect to docker container with ssh
```
docker-compose up -d --build
docker ps
docker exec -it <CONTAINER ID> bash
cp .env.example .env
php artisan migrate
```
Add api key for looci to .env file

Visit http://localhost:8888/

