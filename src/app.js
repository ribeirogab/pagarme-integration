require('dotenv').config({ path: '.env' });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect(
  "mongodb+srv://ribeirogab:123@mycluster.odgmv.gcp.mongodb.net/struko?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }
);

class AppController {
  /**
   *
   * @param {Object} [param0] Application configuration
   * @param {Number} [param0.port] Application port
   */
  constructor({ port = process.env.PORT || 3333 } = {}) {
    this.express = express()
    this.port = port

    this.middlewares()
    this.routes()
  }

  middlewares() {
    this.express.use(express.json())
    this.express.use(cors())
  }

  routes() {
    this.express.use('/v1', require('./routes/v1'))
  }

  listen() {
    return new Promise((resolve, reject) => {
      this.listenHttp(resolve, reject)

      /** Listen with HTTPS: */  
    })
  }

  listenHttp(resolve, reject) {
    this.express.listen(this.port, err => {
      if (err) reject(err)

      resolve({ url: 'http://localhost:3333/' })
    }); 
  }
}

module.exports = new AppController()