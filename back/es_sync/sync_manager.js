class SyncManager {
  constructor(esClient, mysqlClient) {
    this.esClient = esClient;
    this.mysqlClient = mysqlClient;
  }

  UpdateArticle(data) {
    this.esClient
      .index({
        index: "article",
        type: "_doc",
        id: data.id,
        body: data,
      })
      .catch((err) => console.error(err));
  }

  DeleteArticle(data) {
    this.esClient
      .delete({
        index: "article",
        type: "_doc",
        id: data.id,
      })
      .catch((err) => console.error(err));
    console.log("in DeleteArticle,data===>>", data);
  }

  SyncArticle(type, data) {
    console.log("in SyncArticle===>", type, data);
    if (typeof data.id === "undefined") {
      throw new TypeError("id undefined");
    }
    switch (type) {
      case "insert":
      case "update":
        this.UpdateArticle(data);
        break;
      case "delete":
        this.DeleteArticle(data);
        break;

      default:
        break;
    }
  }

  // myQuery(sql, params) {
  //   let mysqlClient = this.mysqlClient;
  //   return new Promise((resolve, reject) => {
  //     mysqlClient.query(sql, params, (err, res) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(res);
  //       }
  //     });
  //   });
  // }
}

module.exports = { SyncManager };
