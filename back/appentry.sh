#!/bin/sh
chown -R www-data /var/www/blog

apt update
apt install -y libzip-dev
apt install -y git

if ! command -v composer &> /dev/null
then
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer

    rm composer-setup.php
fi

docker-php-ext-install pdo pdo_mysql zip

cd /var/www/blog

cp /var/www/blog/.env.example /var/www/blog/.env

php artisan migrate

# php:8-fpm元々のentrypoint
# 参考元：https://hub.docker.com/layers/library/php/8-fpm/images/sha256-5a955d7505e67c35644c9c9220e657bc9636b920ac6edb833bd685777aedd9b4?context=explore
docker-php-entrypoint

php-fpm

