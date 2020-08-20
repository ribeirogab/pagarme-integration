const app = require('./app')
const getIPAddress = require('./utils/os')

app
  .listen()
  .then(({ url }) => {
    console.log(`🚀  Server is running with HTTP at ${url} and locally ${url.replace('127.0.0.1', getIPAddress())}`)
  })
  .catch(err => {
    console.error(err)
    process.exit(err.code)
  })