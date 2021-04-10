const Assert = require('assert-plus')
const Vote = require('../../entities/sys/vote')
const Poll = require('../../entities/sys/poll')
const { fetchProp } = require('../../lib/utils')
const { lock } = require('../../lib/lock')
const { NotFoundError } = require('../../lib/errors')

class CastVoteService {
  static async castVote(args, ctx) {
    Assert.object(args, 'args')
    Assert.object(ctx, 'ctx')

    const seneca = fetchProp(ctx, 'seneca')

    const voter_id = fetchProp(args, 'voter_id')
    const voter_type = fetchProp(args, 'voter_type')
    const poll_id = fetchProp(args, 'poll_id')
    const vote_type = fetchProp(args, 'vote_type')

    return lock(async () => {
      const poll = await Poll.entity({ seneca }).load$({ id: poll_id })

      if (!poll) {
        throw new NotFoundError(`Poll with id ${poll_id} does not exist.`)
      }


      const existing_vote = await Vote.entity({ seneca })
        .load$({
          voter_id,
          voter_type,
          poll_id
        })

      if (existing_vote) {
        const existing_vote_type = fetchProp(existing_vote, 'type')

        if (vote_type !== existing_vote_type) {
          await existing_vote 
            .data$({ type: vote_type })
            .save$()
        }

        return
      }

      const vote_attributes = {
        poll_id,
        type: vote_type,
        voter_id,
        voter_type,
        created_at: new Date(),
        updated_at: null
      }

      const _new_vote = await Vote.entity({ seneca })
        .make$()
        .data$(vote_attributes)
        .save$()

      return
    })
  }
}

module.exports = CastVoteService
