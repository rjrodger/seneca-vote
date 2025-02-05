const Assert = require('assert-plus')
const Poll = require('../../entities/sys/poll')
const Vote = require('../../entities/sys/vote')
const groupBy = require('lodash.groupby')
const isMatch = require('lodash.ismatch')
const { fetchProp } = require('../../lib/utils')

class GetPollVoteStats {
  static async getVoteStatsForPoll(args, ctx) {
    Assert.object(args, 'args')
    Assert.object(ctx, 'ctx')

    const seneca = fetchProp(ctx, 'seneca')
    const poll_id = fetchProp(args, 'poll_id')

    const num_upvotes = await numVotesForThePollWhere({ type: Vote.TYPE_UP() })
    const num_downvotes = await numVotesForThePollWhere({ type: Vote.TYPE_DOWN() })

    return { num_upvotes, num_downvotes }


    function numVotesForThePollWhere(poll_attrs) {
      return Vote.entity({ seneca })
        .list$({ poll_id })
        .then(groupVotesByVoter)
        .then(votes_by_voter => {
          return votes_by_voter.map(votes => {
            Assert.array(votes, 'votes')
            Assert(votes.length > 0, 'votes.length')

            const [actual_vote,] = votes.sort(desc(byDateOfVote))

            return actual_vote
          })
        })
        .then(actual_votes => actual_votes.filter(vote => isMatch(vote, poll_attrs)))
        .then(votes => votes.length)


      function groupVotesByVoter(votes) {
        Assert.array(votes, 'votes')

        const groups = groupBy(votes, byVoter)

        return Object.values(groups)
      }

      function byVoter(vote) {
        Assert.object(vote, 'vote')

        const voter_id = fetchProp(vote, 'voter_id', Assert.string)
        const voter_type = fetchProp(vote, 'voter_type', Assert.string)

        return [voter_id, voter_type].join('.')
      }

      function byDateOfVote(vote1, vote2) {
        Assert.object(vote1, 'vote1')
        Assert.object(vote2, 'vote2')

        const voted_at1 = fetchProp(vote1, 'created_at', Assert.date)
        const voted_at2 = fetchProp(vote2, 'created_at', Assert.date)

        return voted_at1.getTime() - voted_at2.getTime()
      }

      function desc(cmp) {
        return (x, y) => -1 * cmp(x, y)
      }
    }
  }
}

module.exports = GetPollVoteStats
