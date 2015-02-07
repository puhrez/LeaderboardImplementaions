/* jslint indent: 4*/
"use strict";
var redis = require("redis");
function get(obj, key, def_val) {
  if (obj.hasOwnProperty(key)) {
    return key;
  }
  return obj[key] = def_val;
}
function processSList(arr) {
  var len = arr.length;
  var result = [];
  function loop(a) {
    var head = arr[0];
    if (result.length === len / 2) {
      return result;
    } else if (typeof head === 'string') {
      result.push({});
      result[result.length-1][arr.shift()] = arr.shift();
      loop(arr);
    }
  }
  loop(arr)
  return result;
}

function isFunction(obj) {
  var result = typeof obj === 'function';
  //console.log("type?", typeof obj);
  return result;
}
module.exports = function LeaderBoard(id, options) {
  options || (options = {});
  var DEFAULTS = {
    pgSize : 25,
    host : "localhost",
    port : 6379,
    db : 0,
    reverse: false
  };

  var pgSize = get(options, 'pgSize', DEFAULTS.pgSize);
  if (pgSize < 1) {
    pgSize = DEFAULTS.pgSize;
  }
  var redisHost = get(options, 'host', DEFAULTS.host),
    redisPort = get(options, 'port', DEFAULTS.port),
    redisDB = get(options, 'db', DEFAULTS.db),
    rev = get(options, 'reverse', DEFAULTS.reverse);

  var client = redis.createClient(redisPort, redisHost, redisDB);
  return {
    id: id,
    options: JSON.parse(JSON.stringify(options)),
    pgSize: pgSize,
    reverse: rev,
    rClient: client,
    onConnect: function hndlr(cb) {
      if (isFunction(cb)) {
        this.rClient.stream.addListener("connect", cb);
      }
    },
    getCount: function hndlr(cb) {
      this.rClient.zcard(this.id, function (err, num) {
        if (isFunction(cb)) {
          cb(err, parseInt(num, 10));
        }
      });
    },
    rank: function hndlr(member, cb) {
      if (this.reverse) {
        this.rClient.zrank(this.id, member, function (err, res) {
          if (isFunction(cb)) {
            cb(err, res);
          }
        });
      } else {
        this.rClient.zrevrank(this.id, member, function (err, res) {
          if (isFunction(cb)) {
            cb(err, res);
          }
        });
      }
    },
    isMember: function hndlr(member, cb) {
      this.rank(member, function (err, res) {
        if (isFunction(cb)) {
          cb(err, res !== null);
        }
      });
    },
    isMemberInRange: function hndlr(low, high, member, cb) {
      this.rank(member, function (err, res) {
        if (res > low && res < high) {
          if (isFunction(cb)) {
            cb(err, true);
          }
          return true;
        }
        if (isFunction(cb)) {
          cb(err, false);
        }
      });
    },
    rankMember: function hndlr(member, score, cb) {
      this.rClient.zadd([this.id, score, member], function (err, res) {
        if (isFunction(cb)) {
          cb(err, (res >= 0));
        }
      });
    },
    score: function hndlr(member, cb) {
      this.rClient.zscore(this.id, member, function (err, res) {
        if (isFunction(cb)) {
          cb(err, parseInt(res, 10));
        }
      });
    },
    getMember: function hndlr(member, cb) {
      var self = this;
      var obj = {
        member: member
      };
      this.isMember(member, function (err, is) {
        if (err) {
          cb(err);
        }
        if (is) {

          self.rank(member, function (err, res) {
            if (err) {
              cb(err);
            }
            obj.rank = res;
            self.score(member, function (err, res) {
              obj.score = res;
              cb(err, obj);
            });
          });
        } else {
          cb(null, false);
        }
      });
    },
    getAll: function hndlr(cb) {
      this.getInRange(0, -1, function (err, res) {
        if (isFunction(cb)) {
          cb(err, res);
        }
      });
    },
    getTop: function hndlr(limit, cb) {
      this.getInRange(0, limit - 1, function (err, res) {
        if (isFunction(cb)) {
          cb(err, res);
        }
      });
    },
    clear: function hndlr(cb) {
      this.rClient.del(this.id, function (err, success) {
        if (isFunction(cb)) {
          cb(err, success);
        }
      });
    },
    getInRange: function (low, high, cb) {
      this.rClient.zrevrange(this.id, low, high, 'withscores', function (err, res) {
        if (isFunction(cb)) {
          cb(err, processSList(res));
        }
      });
    },
    getAround: function (member, offset, cb) {
      var self = this;
      this.rank(member, function (err, res) {
        if (err) {
          cb(err);
        }
        self.getInRange(res - offset, res + offset, function (err, res) {
          if (isFunction(cb)) {
            cb(err, res);
          }
        });
      });
    },
    delete: function hndlr(member, cb) {
      this.rClient.zrem(this.id, member, function (err, res) {
        if (isFunction(cb)) {
          cb(err, !!res);
        }
      });
    },
    quit: function hndlr(cb) {
      this.rClient.quit(function (err, res) {
        if (isFunction(cb)) {
          cb(err, res);
        }
      });
    }
  };
};