chai = require "chai"
LeaderBoard = require "../lib/leaderboard.js"
expect = chai.expect

describe "LeaderBoard", ->
    lb = new LeaderBoard "game"
    describe "create", ->
        it 'should create a new board', ->
            expect(lb.id).equal "game"
    describe "clear", ->
        it "should clear the board" , ->
            lb.clear (err, success)->
                throw err if err
                expect(success).equal 1

    describe "rankMember", ->
        it 'should rank a member', ->
            lb.rankMember "testMember", 10000, (err, res) ->
                throw err if err
                expect(res).equal true
        it 'should rank 2 more members', ->
            i = 1
            lb.rankMember "testMember2", 2, (err, res) ->
                throw err if err
                expect(res).equal true
            lb.rankMember "testMember3", 1, (err, res) ->
                throw err if err
                expect(res).equal true
            lb.rankMember "testMember4", 3, (err, res) ->
                throw err if err
                expect(res).equal true

    describe 'getCount', ->
        it 'should return total members', ->
            num = 4
            lb.getCount (err, res) ->
                throw err if err
                expect(res).equal num

    describe "rank", ->
        it "should get the rank of members", ->
            lb.rank "testMember", (err, res) ->
                throw err if err
                expect(res).equal 0
            lb.rank "testMember4", (err, res) ->
                throw err if err
                expect(res).equal 1
            lb.rank "testMember2", (err, res) ->
                throw err if err
                expect(res).equal 2
            lb.rank "testMember3", (err, res) ->
                throw err if err
                expect(res).equal 3

    describe "score", ->
        it "should return score", ->
            lb.score "testMember", (err, res) ->
                throw err if err
                expect(res).equal 10000
            lb.score "testMember2", (err, res) ->
                throw err if err
                expect(res).equal 2

    describe "delete", ->
        it "should delete a member", ->
            lb.delete "testMember2", (err, res) ->
                throw err if err
                expect(res).equal true

    describe "isMember", ->
        it "should return false for a nonmember", ->
            lb.isMember "testMember2", (err, res) ->
                console.log("is member outer sanity");
                throw err if err
                expect(res).equal false
        it "should return true for a member", ->
            lb.isMember "testMember4", (err, res) ->
                throw err if err
                expect(res).equal true
    describe "getMember", ->
        it "should return member", ->
            lb.getMember "testMember", (err, res) ->
                throw err if err
                expect(res).not.equal(false);
                expect(res.rank).equal 0
                expect(res.score).equal 10000
                expect(res.member).equal "testMember"
    describe "isMemberInRange", ->
        it "should return true if range is max", ->
            lb.isMemberInRange 0, 10, "testMember3", (err, res) ->
                throw err if err
                expect(res).equal true
        it 'should return false if member is out of range', ->
            lb.isMemberInRange 1, 4, "testMember", (err, res) ->
                throw err if err
                expect(res).equal false
    describe "getAll", ->
        it "should return all members", ->
            lb.getAll (err, res) ->
                throw err if err
                expect(res.length).equal 3
    describe "getTop", ->
        it "should return top 1", ->
            lb.getTop 1, (err, res) ->
                throw err if err
                expect(res.length).equal 1
        it "should get top 3", ->
            lb.getTop 3, (err, res) ->
                throw err if err
                expect(res.length).equal 3
    describe "getAround", ->
        it "should get the 2 around testMember4", ->
            lb.getAround "testMember4", 1, (err, res) ->
                throw err if err
                expect(res.length).equal 3
        it "should get the 1 around testMember3", ->
            lb.getAround "testMember3", 1, (err, res) ->
                throw err if err
                expect(res.length).equal 2