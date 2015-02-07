##Leaderboard
This repository will hold my implementation of a Leaderboard Data Access Object (DAO) persisted to Redis and a RESTful API to interact with the Model.

####Leaderboard DAO:

######Options:

- pgSize: Redis page size / 25
- host: host to connect to /"localhost"
- port: port to connect to / 6379
- db: database to connect to / 0
- reverse: wheher to reverse the sorted set / false
- onConnect() - callback when connected to db
- getCount(callback: Function) - return number of elements in set
- rank(member: String, callback: Function) - return the rank of member
- isMember(member: String, callback: Function) - return whether member is in set
- isMemberInRange(low: Int, high: Int, member: String, callback: Function) - return whether member's rank is in between low and high (exclusive)
- rankMember(member: String, score: Int. callback: Function) - post/update a member and its score.
- score(member: String, callback: Function) - return the score of member
- getMember(member: String, callback: Function) - return name, score, rank of member
- getAll(callback: Function) - get all the members of the set
- getTop(n: Int, callback: Function) - get top n members
- clear(callback: function) - clear the learderboard
- getIntRange(low: Int, high: Int, callback: Function) - get the member whose rank is inbeteween low and high

####RESTful API

####"/api/rank?user=RequestedUser" 
*GET* - GETs the rank of "Requesteduser"

*POST* 
Required Params: 

```
{
	"user": <userId: String>, 
	"score": <userScore: Int> 
}
```

*DELETE* - DELETEs "RequestUser" from the DB
####"/api/rank?getTop?limit=n"
*GET* GETs the top n members
