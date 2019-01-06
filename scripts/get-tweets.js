const fs = require('fs')
const request = require('request')

const CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY
const CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET
const SCREEN_NAME = 'eduardoboucas'
const TARGET_FILE = '_data/tweets.json'

const encodedKey = Buffer.from(
  `${encodeURI(CONSUMER_KEY)}:${encodeURI(CONSUMER_SECRET)}`
).toString('base64')

const getOembed = (screenName, tweetData) => {
  const tweetId = tweetData.id_str

  return new Promise((resolve, reject) => {
    request.get({
      url: `https://publish.twitter.com/oembed?url=https%3A%2F%2Ftwitter.com%2F${screenName}%2Fstatus%2F${tweetId}&omit_script=true`
    }, (err, response, body) => {
      if (err) {
        return reject(err)
      }

      let tweet = JSON.parse(body)
      let signature = `&mdash; ${tweet.author_name} (@${screenName})`
      let signaturePosition = tweet.html.indexOf(signature)

      tweet._date = tweetData.created_at
      tweet._url = `https://twitter.com/${screenName}/status/${tweetId}`
      tweet.html = signaturePosition > 0
        ? tweet.html.slice(0, signaturePosition)
        : tweet.html

      resolve(tweet)
    })
  })
}

request.post({
  body: 'grant_type=client_credentials',
  headers: {
    Authorization: `Basic ${encodedKey}`,
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  url: 'https://api.twitter.com/oauth2/token'
}, (err, response, body) => {
  let parsedBody = JSON.parse(body)

  request.get({
    headers: {
      Authorization: `Bearer ${parsedBody.access_token}`
    },
    url: `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${SCREEN_NAME}&exclude_replies=true&trim_user=true&count=200`
  }, (err, response, body) => {
    let parsedBody = JSON.parse(body)
    let tweets = JSON.parse(body).filter(tweet => {
      return !tweet.retweeted_status
    })
    let oembeds = tweets.map(tweet => getOembed(SCREEN_NAME, tweet))

    Promise.all(oembeds).then(oembedData => {
      fs.writeFileSync(TARGET_FILE, JSON.stringify(oembedData))
    })
  })
})
