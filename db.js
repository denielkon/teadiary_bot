const Pool = require('pg').Pool
const connectionString = 'postgres://hsrdjrroizhruz:4fc5719fa8c597c7d51e1a18392720952fc518c49b6063089b2a1c76f0d8d63a@ec2-99-81-137-11.eu-west-1.compute.amazonaws.com:5432/d9tuu7h18g6dqe'
const pool = new Pool({
   connectionString
   /*user: 'hsrdjrroizhruz',
   password: '4fc5719fa8c597c7d51e1a18392720952fc518c49b6063089b2a1c76f0d8d63a',
   host: 'ec2-99-81-137-11.eu-west-1.compute.amazonaws.com',
   port: '5432',
   database: 'd9tuu7h18g6dqe'*/
})

module.exports = pool