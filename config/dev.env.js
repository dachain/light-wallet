var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
    __HOST__: '"http://localhost:8082/#"',
    __SERVICE__: '"http://47.1.164.78:9218"',
    witnesses: JSON.stringify(['ws://47.1.164.78:28090']),
    faucet_addr: '"http://47.1.164.78:8888"'
  
})
