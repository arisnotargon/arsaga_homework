# arsaga_homework


## ■ 使い方
### ■ サーバー側
docker-compose up -d で起動し、docker-compose psで各コンテナの状態を確認できます。
appコンテナ起動時いろんな操作（ライブラリーインストール、設定、マイグレート）があるので、一分間ほどお待ちください。詳しくはback/appentry.shを参考してください。
起動できたら、下記のコマンドを使って、サーバー側を動作確認できます。
```bash
curl --location '127.0.0.1:8080/createAccount' \
--header 'X-Requested-With: XMLHttpRequest' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "asd111@gmail.com",
    "name": "assad11",
    "password": "123321",
    "password_confirmation":"123321"
}'
```
ステータスコードは200になったら、サーバー側の起動完了しました。

### ■ フロントエンド
下記のコマンドでフロントエンドをインストール、起動
```bash
cd front
yarn install
yarn start
```