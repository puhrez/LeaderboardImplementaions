var frisby = require('frisby'),
  config = require('../config');
frisby.create('rank member')
  .post(config.dev.path + "api/rank", {
      user: "testMember1",
      score: 12
  }, {json: true})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSONTypes({
      status: Boolean
  })
  .expectJSON({
      status: true
  })
  .toss();
frisby.create('get rank')
  .get(config.dev.path + "api/rank?user=testMember3")
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSONTypes({
      rank: Number
  })
  .expectJSON({
      rank: 3
  })
  .toss();
frisby.create('delete member')
  .delete(config.dev.path + "api/rank?user=testMember1")
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSONTypes({
      status: Boolean
  })
  .expectJSON({
      status: true
  })
  .toss();
frisby.create('get top')
  .get(config.dev.path + "api/getTop?limit=10")
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSONTypes({
      top: Array
  })
  .expectJSON(
      { top:[{"testMember": "10000"},
          {"testMember4": "3"},
          {"testMember3": "1"}
      ]
  })
  .toss();