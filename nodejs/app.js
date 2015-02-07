"use strict";
var express = require('express'),
  bodyParser = require('body-parser'),
  app = express(),
  LeaderBoard = require('./lib/leaderboard'),
  lb = new LeaderBoard("game");

app.use(bodyParser.json());

app.route('/api/rank')
  .post(function (req, res) {
    console.log("got post");
    console.log("req:", req.body);
    return lb.rankMember(req.body.user, req.body.score, function (err, reply) {
      if (err) {
        console.log("error");
        return res.status(500).end();
      }
      console.log("reply from post rank:", reply);
      return res.status(200).json(JSON.stringify({status: reply}));
    });
  })
  .get(function (req, res) {

    var user = req.query.user;
    console.log("got get with user:", user);
    return lb.rank(user, function (err, reply) {
      if (err) {
        return res.status(500).end();
      }
      res.contentType("application/json");
      return res.status(200).json({rank: reply});
    });
  })
  .delete(function (req, res) {
    var user = req.query.user;
    console.log("got delete with delete:", user);
    return lb.delete(user, function (err, reply) {
      if (err) {
        return res.status(500).end();
      }
      res.contentType("application/json");
      return res.status(200).json({status: reply});

    });
  });

app.get('/api/getTop', function (req, res) {
  var limit = parseInt(req.query.limit, 10);
  console.log("got getTop with limit:", limit);
  return lb.getTop(limit, function (err, reply) {
    if (err) {
      return res.status(500).end();
    }
    console.log("reply from top:", reply);
    res.contentType("application/json");
    return res.status(200).json({top: reply});
  });
});
app.listen(3000);
console.log("listening on port 3000");