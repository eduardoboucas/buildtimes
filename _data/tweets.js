const fs = require('fs')
const path = require('path')
const request = require('request')

const CACHE_PATH = './.twitter-cache.json'
const CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY
const CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET
const SCREEN_NAME = process.env.TWITTER_SCREEN_NAME

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

      const tweet = JSON.parse(body)
      const signature = `&mdash; ${tweet.author_name} (@${screenName})`
      const signaturePosition = tweet.html.indexOf(signature)

      console.log(JSON.stringify(tweetData))

      tweet._date = tweetData.created_at
      tweet._url = `https://twitter.com/${screenName}/status/${tweetId}`
      tweet.html = signaturePosition > 0
        ? tweet.html.slice(0, signaturePosition)
        : tweet.html

      resolve(tweet)
    })
  })
}

module.exports = () => {
  const fullCachePath = path.resolve(CACHE_PATH)

  try {
    const tweets = require(fullCachePath)

    console.log('Loading tweets from local cache...')

    return tweets
  } catch (err) {
    console.log('Could not load tweets from local cache. Fetching from origin...')
  }

  return new Promise((resolve, reject) => {
    request.post({
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${encodedKey}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      url: 'https://api.twitter.com/oauth2/token'
    }, (err, response, body) => {
      if (err) {
        return reject(err)
      }

      const parsedBody = JSON.parse(body)
    
      request.get({
        headers: {
          Authorization: `Bearer ${parsedBody.access_token}`
        },
        url: `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${SCREEN_NAME}&exclude_replies=true&trim_user=true&count=20&tweet_mode=extended`
      }, (err, response, body) => {
        const tweets = JSON.parse(body).filter(tweet => !tweet.retweeted_status)
        const oembeds = tweets.map(tweet => getOembed(SCREEN_NAME, tweet))

        Promise.all(oembeds).then(data => {
          fs.writeFile(fullCachePath, JSON.stringify(data), err => {
            if (err) {
              console.log('Could not write tweets to local cache:', err)
            }
          })

          resolve(data)
        }).catch(reject)
      })
    })
  })
}
