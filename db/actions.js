const assert = require('assert');
const { client } = require('./client');
const { db: { chatCollection } } = require('../config');

module.exports = {
  chat: {
    save: async (data) => {
      const db = client.db(process.env.MONGO_DB_NAME);
      const id = db.collection(chatCollection).insertOne(data, (err) => {
        assert.equal(null, err);
      });
    }
  }
}