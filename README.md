## seneca-vote

A voting plugin for Seneca.js

## Contents:  
- [Requirements](#requirements)
- [Actions](#actions)
- [Dev Scripts](#dev-scripts)

## Requirements

The following Seneca plugins must be plugged in before this plugin
can be used:  
- seneca-entity
- seneca-promisify

Normally, your code would look like this:
```js
const Seneca = require('seneca')
const Entities = require('seneca-entity')
const SenecaPromisify = require('seneca-promisify')
const VotePlugin = require('seneca-vote')

Seneca()
  .use(Entities)
  .use(SenecaPromisify)
  .use(VotePlugin)
```

## Actions

* [Upvote Action](#upvote-action)  
* [Downvote Action](#downvote-action)  
* [Open Poll Action](#open-poll-action)  
* [Get Poll Action](#get-poll-action)  


## Action Descriptions

### Upvote Action

#### Pattern

`sys:vote,vote:up`

#### Params

- _fields.poll_id__ : ID! : The ID of the poll to upvote on.
- _fields.voter_id__ : ID! : The ID of the voter.
- _fields.voter_type__ : "sys/user"! : The type of the voter. Currently only "sys/user" is supported.

#### Description

Creates an upvote for a poll. If the voter has already downvoted on the poll,  
the downvote will be replaced by an upvote. On success, the number of upvotes  
and downvotes are counted and included in the response.

#### Responses

Upon successful upvote:
```js
{ ok: true, data: { num_upvotes: Int!, num_downvotes: Int! } }
```

Upon failed validation of the request params:
```js
{
  ok: false,
  why: String,
  details?: { path: Array<Any>?, why_exactly: String? }
}
```

When the poll does not exist:
```js
{ ok: false, why: String, details?: { what: String? } }
```

### Downvote Action

#### Pattern
`sys:vote,vote:down`

#### Params
- _fields.poll_id__ : ID! : The ID of the poll to upvote on.
- _fields.voter_id__ : ID! : The ID of the voter.
- _fields.voter_type__ : "sys/user"! : The type of the voter. Currently only "sys/user" is supported. 

#### Description

Creates an downvote for a poll. If the voter has already upvoted on the poll,  
the upvote will be replaced by a downvote. On success, the number of upvotes  
and downvotes are counted and included in the response.

#### Responses

Upon successful downvote:
```js
{ status: "success", data: { num_upvotes: Int!, num_downvotes: Int! } }
```

Upon failed validation of the request params:
```js
{
  ok: false,
  why: String,
  details?: { path: Array<Any>?, why_exactly: String? }
}
```

When the poll does not exist:
```js
{ ok: false, why: String, details?: { what: String? } }
```


### Open Poll Action

#### Pattern
`sys:vote,open:poll`

#### Params
- _fields.title__ : string! : The title of the poll.

#### Description

Creates a new poll with the given title. If a poll with the given title already exists,  
then action will nontheless succeed, but a new poll will not be created. On success,  
the poll data is returned.  

#### Responses

Upon success:
```js
{
  status: "success",
  
  data: {
    poll: {
      id: ID!,
      title: String!,
      created_at: Date!,
      updated_at: Date?
    }
  }
}
```

Upon failed validation of the request params:
```js
{
  ok: false,
  why: String,
  details?: { path: Array<Any>?, why_exactly: String? }
}
```

### Get Poll Action

#### Pattern
`sys:vote,get:poll`

#### Params
- _poll_id__ : ID! : The ID of the poll to get.

#### Description
Upon success, returns the poll data. Returns an error message if the poll with  
the given ID does not exist.

#### Responses
Upon success:
```js
{
  status: "success",
  
  data: {
    poll: {
      id: ID!,
      title: String!,
      created_at: Date!,
      updated_at: Date?
    }
  }
}
```

Upon failed validation of the request params:
```js
{
  ok: false,
  why: String,
  details?: { path: Array<Any>?, why_exactly: String? }
}
```

When the poll does not exist:
```js
{ ok: false, why: String, details?: { what: String? } }
```

#### Plugin Options
`locks_disabled : Boolean?`
By default, this option is set to `true`, i.e. locks are disabled by default.
If set to `false`, re-enabled locks which help prevent potential race conditions
in actions.  
  
During implementation work on seneca-vote, in order to meet certain MVP
requirements, such as that there can only ever be a single poll record with the
same title, - locks were implemented as part of seneca-vote to prevent race
conditions, that may otherwise occur under high loads.  
  
It was ultimately decided to disable the locks by default in order to comply
with the rest of the Seneca eco-system. Entity upserts are planned to be added
to Seneca entities in the future. They will work as upserts normally do:  
https://docs.mongodb.com/drivers/node/fundamentals/crud/write-operations/upsert/  
https://www.postgresqltutorial.com/postgresql-upsert/  
  
Further work on the data model of seneca-vote is expected in order to both
prevent race conditions and remain compliant with the rest of the Seneca
eco-system.  
  
#### Dev Scripts
`$ npm test`  
Runs the automated tests.  

`$ npm run check-coverage`  
Generates a test coverage report.  

