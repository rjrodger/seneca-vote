const Assert = require('assert-plus')
const { fetchProp } = require('../../lib/utils')

class Vote {
  static entity(args) {
    Assert.object(args, 'args')

    const seneca = fetchProp(args, 'seneca', Assert.object)

    return seneca.entity('sys/vote')
  }

  static TYPE_UP() {
    return 'up'
  }

  static TYPE_DOWN() {
    return 'down'
  }
}

module.exports = Vote
