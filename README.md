```
git clone https://github.com/tomopongrac/flight-search.git
cd flight-search
composer install
docker-compose up -d --build
docker ps
docker exec -it <CONTAINER ID> bash
cp .env.example .env
php artisan migrate
```
Add api key for looci in .env file

Visit http://localhost:8888/

