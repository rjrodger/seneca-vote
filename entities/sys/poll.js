const Assert = require('assert-plus')
const { fetchProp } = require('../../lib/utils')
const Shapes = require('../../lib/shapes')

class Poll {
  static entity(args) {
    Assert.object(args, 'args')

    const seneca = fetchProp(args, 'seneca', Assert.object)

    return seneca.entity('sys/poll')
  }
}

module.exports = Poll
