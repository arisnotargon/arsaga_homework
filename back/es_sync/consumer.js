const Redis = require("ioredis");
const { SyncManager } = require("./sync_manager");
const redisClient = new Redis({
  host: "redis",
  port: 6379,
});

const es = require("elasticsearch");
const esClient = es.Client({ host: "elasticsearch:9200" });

const mysql = require("mysql");
const mysqlClient = mysql.createConnection({
  host: "mysql",
  user: "blog",
  password: "blog",
  port: "3306",
  database: "blog",
});

mysqlClient.connect();

const syncManager = new SyncManager(esClient, mysqlClient);

redisClient.subscribe("maxwell", (e) => {
  console.log("subscribe channel: maxwell");
});

redisClient.on("message", (channel, message) => {
  console.log(`channel: ${channel},message: ${message}`);
  try {
    msgObj = JSON.parse(message);
  } catch (err) {
    console.log("json decode failed,maybe heart beat message" + message, err);
    return;
  }

  if (
    typeof msgObj.database !== "undefined" &&
    typeof msgObj.table !== "undefined" &&
    typeof msgObj.type !== "undefined" &&
    typeof msgObj.data !== "undefined"
  ) {
    switch (msgObj.table) {
      case "article":
        syncManager.SyncArticle(msgObj.type, msgObj.data);
        break;
      case "article_category":
        syncManager.SyncArticleCategory(msgObj.type, msgObj.data);
        break;
    }
  } else {
    console.log("msgObjErr:::", msgObj);
    return;
  }
});

redisClient.on("error", (err) => {
  console.log("response err:" + err);
});
