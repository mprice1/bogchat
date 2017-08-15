"use strict";

require('dotenv').config()
process.title = 'node-chat-staging'

var http = require('http')
const xrequest = require('request')

// mysql
var mysql = require('mysql')
var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'admin',
  password : process.env.sql,
  database : 'bogchat'
})

// jollo radio
var WebSocket = require('ws')
  , ws
  
var wsradioreconnectretry

function wsradioconnect() {
  wsradioreconnectretry = setTimeout(function() {
    wsradioreconnect()
  },60000)
  ws = new WebSocket('ws://radio.jollo.org/socket/websocket?token=undefined&vsn=1.0.0')
}

wsradioconnect()
  
function wsradioreconnect() {
  clearInterval(wsheartbeat)
  ws.close()
  setTimeout(function() {
    // reconnect in 3 minutes
    wsradioconnect()
  },180000)
}

var wsref = 1
  , wsheartbeat
  , wsplaystate = "stopped"
  , wsplaylisttitle = null
  , wsplaylisturl = null
  , wsplaylistuser = null
  , wsplaylistduration = 0
  , wsplaylist = {}
  , wsplaylistremain = 0
  , wsradioctimeinit = 0
  , wspayload = {}
  
var wsplaylistfilename = null

ws.on('open', function() {
  console.log("connected")
  clearInterval(wsheartbeat)
  wssend(0)
  setTimeout(function(){
    wssend(1)
  },500)
  wsheartbeat = setInterval(function(){
    wssend(2)
  },20000)
})

ws.on('error', function() {
  wsradioreconnect()
  
})

function broadcast(json) {
  for ( var i=0; i<clients.length; i++ ) {
    clients[i].sendUTF(JSON.stringify(json))
  }  
}

function wstrackchange(e) {
  if (!e) {
    console.log("stopped")
    wsplaystate = "stopped"
    wsplaylistfilename = null
    broadcast({
      type: 'radio',
      payload: 'power',
      power: 'stopped'
    })
    broadcast({
      type: 'radio',
      payload: 'remain',
      remain: 0
    })
    return
  }
  // send signal to open everyones audio player if its not already open
  function validateyoutubeurl(url) {
    if (url != undefined || url != '') {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      if (match && match[2].length == 11) {
      // Do anything for being valid
      // if need to change the url to embed url then use below line
        return [true,match[2]]
      // $('#ytplayerSide').attr('src', 'https://www.youtube.com/embed/' + match[2] + '?autoplay=0');
      }
      else {
        return [false,null]
      // Do anything for not being valid
      }
    }
  }
  
    
  console.log("new track")

  wsplaystate = "playing"
  wsplaylistfilename = e.filename
  wsradioctimeinit = + new Date();
  
  broadcast({
    type: 'radio',
    payload: 'power',
    power: 'playing'
  })
  
  wsplaylisttitle = e.title
  wsplaylisturl = e.url
  wsplaylistuser = e.user
  wsplaylistduration = 0
  
  function nonyoutubebroadcast() {
    broadcast({
      type: 'radio',
      payload: 'track',
      track: {
        title: e.title,
        url: e.url,
        user: e.user,
        duration: 0,
        ctime: wsradioctimeinit
      }
    })
  }
  if (validateyoutubeurl(e.url)) {
    var yturl = validateyoutubeurl(e.url)[1]
    xrequest('https://www.googleapis.com/youtube/v3/videos?id='+yturl+'&part=contentDetails&key='+process.env.ytapi, (err,res,body) => {
      var json = JSON.parse(body)
      if ( json
        && json.items
        && json.items[0]
        && json.items[0].contentDetails
        && json.items[0].contentDetails.duration ) {
        wsplaylistduration = json.items[0].contentDetails.duration
        broadcast({
          type: 'radio',
          payload: 'track',
          track: {
            title: e.title,
            url: e.url,
            user: e.user,
            duration: wsplaylistduration,
            ctime: wsradioctimeinit
          }
        })          
      }
      else {
        nonyoutubebroadcast()
      }
    })    
  }
  else {
    nonyoutubebroadcast()
  }
}

function wssend(i) {
  var wsevents = ["phx_join","sync","heartbeat"]
  ws.send(JSON.stringify(
    {
      "topic":(i==2) ? "phoenix" : "playlist:lobby",
      "event":wsevents[i],
      "payload":{},
      "ref":wsref
    }
  ))
  wsref++
}

var wstimeout

ws.on('message', function(message) {
  
  clearTimeout(wsradioreconnectretry)
  
  clearTimeout(wstimeout)
  wstimeout = setTimeout(function() {
    wsradioreconnect()
  },60000)
  
  var message = JSON.parse(message)
  if (message && message.payload) {
    if (message.payload.playlist) {
      if (message.payload.playlist.tracks) {
        wsplaylist = message.payload.playlist.tracks
      }
      if (message.payload.playlist.playstate) {
        wsplaystate = message.payload.playlist.playstate
        if (wsplaystate == "playing") {
          if (message.payload.playlist.current_track && message.payload.playlist.current_track.filename) {
            
            wspayload = message.payload
            broadcast({
              type: 'radio',
              payload: 'playlist',
              playlist: message.payload
            })
            
            if (wsplaylistfilename != message.payload.playlist.current_track.filename) {
              wsplaylistfilename = message.payload.playlist.current_track.filename
              wstrackchange(message.payload.playlist.current_track)
            }
              
            var remain = wsplaylist.map((x) => { return x.filename }).indexOf(wsplaylistfilename)
            wsplaylistremain = remain
            
            broadcast({
              type: 'radio',
              payload: 'remain',
              remain: remain
            })
          }
          else {
            console.log("server error")
            //ghost track
            wsplaylisttitle = null
            wsplaylisturl = null
            wsplaylistuser = null
            wsplaylistduration = null
            broadcast({
              type: 'radio',
              payload: 'track',
              track: {
                title: null,
                url: null,
                user: null,
                duration: 0,
                ctime: wsradioctimeinit
              }
            })
          }
        }
        else {
          wstrackchange(false)
        }
      }
    }
  }
  else {
    console.log("nothing")
  }
});

var webSocketsServerPort = 1337
var beepport = 2834

var webSocketServer = require('websocket').server
var SHA256 = require("crypto-js/sha256")
var CryptoJS = require("crypto-js")

// jollo irc

var irc = require('irc')

const ircme = `bogchat`
const ircport = 9999
const irchost = `irc.jollo.org`

var client = new irc.Client(irchost, ircme, {
    channels: ['#asdf'],
    userName: ircme,
    debug: true,
    realName: ircme,
    port: ircport,
    selfSigned: true,
    debug: false,
    showErrors: false,
    secure: true,
    floodProtection: false,
})

client.addListener('error', (n) => {} )

function hashstringify(wordArray) {
  var words = wordArray.words
  var sigBytes = wordArray.sigBytes
  var hexChars = []
  for (var i = 0; i < sigBytes; i++) {
    var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
    hexChars.push((bite >>> 4).toString(16))
    hexChars.push((bite & 0x0f).toString(16))
  }
  return hexChars.join('')
}
  
function uniquepush(item, oldarray) {

  if (oldarray.indexOf(item) === -1) {
    oldarray.push(item)
  }

  return oldarray
}

//if (typeof localStorage === "undefined" || localStorage === null) {
var LocalStorage = require('node-localstorage').LocalStorage
var localStorage = new LocalStorage('./scratch')
//}

// var feedpeach = 0
// var feedpepper = 0
// 
// if (localStorage.getItem('xfeedpeach') ) {
//   feedpeach = localStorage.getItem('xfeedpeach')
// }
// if (localStorage.getItem('xxfeedpepper') ) {
//   feedpepper = localStorage.getItem('xxfeedpepper')
// }

var bannedips = [ ]

if (localStorage.getItem('xbannedips') ) {
  bannedips = JSON.parse(localStorage.getItem('xbannedips'))
}
var zooips = [ ]

if (localStorage.getItem('xzooips') ) {
  zooips = JSON.parse(localStorage.getItem('xzooips'))
}

var shadowips = [ ]

if (localStorage.getItem('xshadowips') ) {
  shadowips = JSON.parse(localStorage.getItem('xshadowips'))
}

var history = [ ]

if (localStorage.getItem('history') ) {
  history = JSON.parse(localStorage.getItem('history'))
}

var clients = [ ]

var increment = 0;

if (localStorage.getItem('increment') ) {
  increment = JSON.parse(localStorage.getItem('increment'))
}

function mres(str) {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function(char) {
    switch (char) {
      case "\0":
        return "\\0";
      case "\x08":
        return "\\b";
      case "\x09":
        return "\\t";
      case "\x1a":
        return "\\z";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\"":
      case "'":
      case "\\":
      case "%":
        return "\\"+char;
    }
  });
}

function richtext(input) {
  console.log(input)
  var matches = []
  function checkimgurl(url) {
    return(url.match(/^https?\:\/\/.+\/.+\.(jpeg|jpg|gif|png|bmp|JPEG|JPG|GIF|PNG|BMP)$/) != null)
  }
  var string = input.split(" ")
  for (var i=0;i<string.length;i++) {
    var word = string[i]
    if (checkimgurl(word)) {
      matches.push(word)
    }
  }

  return matches
}

function tryjson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function htmlEntities(str) {
  return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/'/g, '&apos;')
          .replace(/"/g, '&quot;')
          .substring(0,30000)
}

function beepEntities(str) {
  return String(str)
          .replace(/&/g, '+')
          .replace(/</g, '(')
          .replace(/>/g, ')')
          .replace(/'/g, '`')
          .replace(/"/g, '`')
          .substring(0,30000)
}

var server = http.createServer(function(request, response) {})

server.listen(webSocketsServerPort, function() {
  console.log("Bogchat websocket server is listening on port " + webSocketsServerPort)
});

var wsServer = new webSocketServer({
  httpServer: server
});

client.addListener('message', (...a) => {

  let nick        = a[0]
  let chan        = a[1]
  let fulladdress = a[3].prefix
  
})

wsServer.on('request', function(request) {
  
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }
    return array;
  }
  
  var colors = [ 'red', 'blue', 'purple', 'magenta', 'coral', 'blue', 'orangered'];
  colors = shuffle(colors)

  var connection = request.accept(null, request.origin); 
  
  // // disabling sound.. revive in legacy
  var json = JSON.stringify({ type:'hi' });
  for (var i=0; i < clients.length; i++) {
   clients[i].sendUTF(json);
  }
  
  var index = clients.push(connection) - 1;
  var userName = false;
  var userColor = false;

  console.log((new Date()) + ' Connection accepted.');

  if (history.length > 0) {
    connection.sendUTF(JSON.stringify( { type: 'history', data: history} ));
  }

  connection.on('message', function(message) {
    if (bannedips.indexOf(connection.remoteAddress) > -1) {
      return
    }
    var zooflag = false
    if (zooips.indexOf(connection.remoteAddress) > -1) {
      zooflag = true
    }
    var shadowflag = false
    if (shadowips.indexOf(connection.remoteAddress) > -1) {
      shadowflag = true
    }
    if (message.type === 'utf8') {
      
      if (userName === false) {
        if ( tryjson(message.utf8Data)) {
          var parsed = JSON.parse(message.utf8Data)
          if (parsed.type == "nick" ) {
            userName = encodeURIComponent(htmlEntities(parsed.data))
            userName = userName.substring(0,100)
            userColor = colors[0];

            if (userName == "yvonne" || userName == "hali" || userName == `yvonne's phone: honk` || userName == "yvonnie") {
              userColor = "magenta"
            }
            connection.sendUTF(JSON.stringify({ type:'color', data: userColor }))
          }
        }
      }
      else {
        if ( tryjson(message.utf8Data) ) {
          var parsed = JSON.parse(message.utf8Data)
          
          ;(({
            message: () => {
              increment++
              var thistime = (new Date()).getTime()
              var thismessage = encodeURIComponent(htmlEntities(parsed.data))
              var thislocale = CryptoJS.AES.encrypt(connection.remoteAddress, process.env.aes).toString()
              var obj = {
                time: thistime,
                zoo: zooflag,
                text: thismessage,
                author: userName,
                color: userColor,
                locale: thislocale,
                id: increment
              }
              if (!zooflag && !shadowflag) {
                history.push(obj);
                history = history.slice(-100);
                localStorage.setItem('history', JSON.stringify(history))
              }
              localStorage.setItem('increment', increment)
              var ctime = parseInt((+ new Date()).toString().slice(0,-3))
              var matches = richtext(decodeURIComponent(thismessage)).slice(0,10)
              if (!zooflag && !shadowflag) {
                console.log("good got here its matches length" + matches.length)
                for (var i=0;i<matches.length;i++) {
                  pool.query('INSERT INTO bogchat (postid, username, context, ctime) VALUES ('+increment+', "'+mres(userName.toString().substring(0,100))+'", "'+mres(matches[i])+'", '+ctime+')', function (error, results, fields) {
                    if (error) {
                      throw error
                    }
                  })
                }
              }
              else {
                console.log("was zooflagged or shadowflagged so snub")
                console.log("zooflag" + zooflag)
                console.log("shadowflag" + shadowflag)
              }
              var json = JSON.stringify({ type:'message', data: obj })
              
              if (shadowflag) {
                connection.sendUTF(json);
              }
              else {
                for (var i=0; i < clients.length; i++) {
                  clients[i].sendUTF(json);
                }              
              }
            },
            drum: () => {
              increment++
              var thistime = (new Date()).getTime()
              var thismessage = encodeURIComponent(htmlEntities((parsed.data)))
              var thislocale = CryptoJS.AES.encrypt(connection.remoteAddress, process.env.aes).toString()
              var obj = {
                time: thistime,
                text: thismessage,
                zoo: zooflag,
                drum: true,
                author: userName,
                locale: thislocale,
                color: userColor,
                id: increment
              }
              
              history.push(obj);
              history = history.slice(-100);
              localStorage.setItem('history', JSON.stringify(history))
              localStorage.setItem('increment', increment)
            
              var ctime = parseInt((+ new Date()).toString().slice(0,-3))
              var matches = richtext(thismessage).slice(0,10)
                  
              var json = JSON.stringify({ type:'drum', data: obj })
              if (zooflag || shadowflag) {
                connection.sendUTF(json)
              }
              else {
                for (var i=0; i < clients.length; i++) {
                  clients[i].sendUTF(json)
                }
              }
            },
            fav: () => {
              if ( parsed.data && !isNaN(parsed.data) ) {
                if (parsed.data <= increment && parsed.data > 0 ) {
                   pool.query('UPDATE bogchat SET favd = (CASE WHEN favd IS NULL THEN 0 ELSE favd END) + 1 WHERE postid = '+mres(parsed.data)+';', function (error, results, fields) {
                     if (error) throw error;
                   });
                   if (zooflag || shadowflag) {
                     connection.sendUTF(JSON.stringify({ type:'fav', data: parsed.data }))  
                   }
                   else {
                    for (var i=0; i < clients.length; i++) {
                      clients[i].sendUTF(JSON.stringify({type:'fav', data: parsed.data}))
                    }
                  }
                }
              }
            },
            ping: () => {
              connection.sendUTF(JSON.stringify({ type:'pong', data: parsed.data }))
            },
            radioqueue: () => {
              // prevent zoo users from using radio
              if (bannedips.indexOf(connection.remoteAddress) > -1) {
                return
              }
              if (zooips.indexOf(connection.remoteAddress) > -1) {
                return
              }
              if (shadowips.indexOf(connection.remoteAddress) > -1) {
                return
              }
              if (parsed.data) {
                connection.sendUTF(JSON.stringify({ type:'status', data: ".." }));
                // client.say('fanfare', `api ${process.env.plinkoapi} msg #radio <${userName.substr(0,10)}> parsed.data`);
                // if its one word and starts with http send just this word
                // else if its multiple words do a query on it using youtube search..
                // send the reply to plinko
                var content = parsed.data.split(" ")
                if (content.length == 1 && content[0].substr(0,4) == "http") {
                  // send plinko this url
                  client.say('plinko', `api ${process.env.plinkoapi} msg #radio <${userName.substr(0,10)}> ${content[0]}`);
                  connection.sendUTF(JSON.stringify({ type:'status', data: "OK" }))
                }
                else {
                  // some kind of search
                  var subdata = (parsed.data).substr(0,100)
                  xrequest('https://www.googleapis.com/youtube/v3/search?part=snippet&q='+encodeURI(subdata)+'&key='+process.env.ytapi, (err,res,body) => {
                    var json = JSON.parse(body)
                    if (json && json.items && json.items.length >= 1) {
                      client.say('plinko', `api ${process.env.plinkoapi} msg #radio <${userName.substr(0,10)}> https://www.youtube.com/watch?v=${json.items[0].id.videoId}`);
                      connection.sendUTF(JSON.stringify({ type:'status', data: "OK" }))
                    }
                    else {
                      connection.sendUTF(JSON.stringify({ type:'status', data: "no results" }))
                    }
                  })
                }
              }
            },
            beeperhistoryrequest: () => {
              pool.query(
               `(
                SELECT * 
                FROM beeper 
                ORDER BY id 
                DESC LIMIT 200
                ) 
                ORDER BY id ASC`, 
              (err,res)=>{
                // need the id
                if (res && res.length) {
                  var messages = []
                  for (var p = 0;p<res.length;p++) {
                    var e = res[p]
                    var message = {
                      id: e.id,
                      message: encodeURIComponent(beepEntities(e.message)),
                      unread: true,
                      sender: null,
                      crypt: null,
                      type: "message",
                      ctime: ( + new Date(e.ctime) ),
                      origin: "sms",
                      private: false,
                      mention: false,
                      reserved: {}
                    }
                    messages.push(message)
                  }
                  connection.sendUTF(JSON.stringify({
                    type:'beeperhistory', 
                    data: messages 
                  }))
                }
              })
            },
            // feedpeach: () => {
            //   localStorage.setItem('xfeedpeach',++feedpeach)
            //   broadcast({
            //     type: 'feedpeach',
            //     data: feedpeach
            //   })              
            // },
            // feedpepper: () => {
            //   localStorage.setItem('xxfeedpepper',--feedpepper)
            //   broadcast({
            //     type: 'feedpepper',
            //     data: feedpepper
            //   })                
            // },
            // getfood: () => {
            //   connection.sendUTF(JSON.stringify({ type:'feedpeach', data: feedpeach }))
            //   connection.sendUTF(JSON.stringify({ type:'feedpepper', data: feedpepper }))
            // },
            whatshot: () => {
              var yctime = (parseInt((+ new Date()).toString().slice(0,-3)) - 86400)
              pool.query('select * from bogchat where ctime > '+yctime+' and favd > 4', function (error, results, fields) {
                if (error) {
                  return
                }
                connection.sendUTF(JSON.stringify({ type:'whatshot', data: results }))
              });
            },
            queryuser: () => {
              if (parsed.data) {
                
                var query = mres(parsed.data.substring(0,100))
                pool.query('select * from bogchat where username = "'+query+'" order by rand() limit 10;', function (error, results, fields) {
                  if (error) throw error;
                  connection.sendUTF(JSON.stringify({ type:'queryuser', data: results }))
                });            
              }
            },
            radio: () => {
              connection.sendUTF(JSON.stringify({ type:'radio', payload: "power", power: wsplaystate }))
              if (wsplaystate == "playing") {
                  connection.sendUTF(JSON.stringify({
                    type: 'radio',
                    payload: 'track',
                    track: {
                      title: wsplaylisttitle,
                      url: wsplaylisturl,
                      user: wsplaylistuser,
                      duration: wsplaylistduration,
                      ctime: wsradioctimeinit
                    }
                  }));
                  connection.sendUTF(JSON.stringify({
                    type: 'radio',
                    payload: 'remain',
                    remain: wsplaylistremain
                  }));
                  connection.sendUTF(JSON.stringify({
                    type: 'radio',
                    payload: 'playlist',
                    playlist: wspayload
                  }));
              }
            },
            oper: () => {
              if (parsed.data && parsed.data.login) {
                if ( hashstringify(SHA256(parsed.data.login)) == process.env.sha ) {
                  connection.sendUTF(JSON.stringify(
                    { 
                      type:'oper',
                      data: {
                        type:"login",
                        message:process.env.opermessage,
                        content:parsed.data.login
                      }
                    }
                  ))
                }
              }
              else {
                if (parsed.data && parsed.data.id) {
                  if ( hashstringify(SHA256(parsed.data.id)) == process.env.sha ) {
                    if (parsed.data.command) {
                      var n = parsed.data.command.split(" ");
                      (({
                        ban: () => {
                          n.splice(0,1)
                          n = n.join(" ")
                          uniquepush(n,bannedips)
                          localStorage.setItem("xbannedips",JSON.stringify(bannedips))
                        },
                        live: () => {
                          broadcast({
                            type: 'live'
                          })
                        },
                        zoo: () => {
                          n.splice(0,1)
                          n = n.join(" ")
                          uniquepush(n,zooips)
                          localStorage.setItem("xzooips",JSON.stringify(zooips))                        
                        },
                        shadow: () => {
                          n.splice(0,1)
                          n = n.join(" ")
                          uniquepush(n,shadowips)
                          localStorage.setItem("xshadowips",JSON.stringify(shadowips))                        
                        },
                        clearzoo: () => {
                          zooips = []
                          localStorage.setItem("xzooips",JSON.stringify(zooips))                        
                        },
                        clearshadow: () => {
                          shadowips = []
                          localStorage.setItem("xshadowips",JSON.stringify(shadowips))                        
                        },
                        clearban: () => {
                          bannedips = []
                          localStorage.setItem("xbannedips",JSON.stringify(bannedips))                        
                        },
                        list: () => {
                          connection.sendUTF(JSON.stringify( {
                              type: 'list', 
                              data: {
                                bannedips: bannedips,
                                shadowips: shadowips,
                                zooips: zooips,
                              }
                            } 
                          ));                    
                        },
                        dec: () => {
                          var bytes  = CryptoJS.AES.decrypt(n[2], process.env.aes)
                          var plaintext = bytes.toString(CryptoJS.enc.Utf8)
                          connection.sendUTF(JSON.stringify( {
                              type: 'decreq', 
                              data: {
                                id: n[1],
                                req: plaintext
                              }
                            } 
                          ));                        
                        },
                      })[n[0]] || (() => {  } ))();
                    }
                  }
                }
              }
            }
          })[parsed.type] || (() => {  } ))();
        }
      }
    } 
  });

  connection.on('close', function(e) {
    for (var i = 0; i < clients.length; i ++) {
    if ((connection.remoteAddress == clients[i].remoteAddress) && (connection.socket._peername.port == clients[i].socket._peername.port)) {
        clients.splice(i, 1)
      }
    }
     var json = JSON.stringify({ type:'byebye' })
     for (var i=0; i < clients.length; i++) {
       clients[i].sendUTF(json)
     }
  })
});

var beepserver = http.createServer(function(request, response) {
   let body = []
    request.on('data', (chunk) => {
      body.push(chunk)
    }).on('end', () => {
      body = Buffer.concat(body).toString()
      //console.log(body)
      if (tryjson(body)) {
        let data = JSON.parse(body)
        if ( !data.messageId
          || !data["from"]
          || !data.text
          || !data.time
          || !data.eventType
          || data.eventType != "sms"
          || data.text.length < 1 ) {
          if (data["from"]) {
            console.log("bad incoming from")
            console.log(data["from"])
          }
          return
        }
        var message = data.text.replace(/(\r\n|\n|\r)/gm," ").substring(0,1000)
        var telenum = data["from"].substring(0,60)
        var sendername = "-"
        var type = "message"
        var origin = "sms"
        var prv = 0
        var messageid = data.messageId
        // sql insert
        pool.query(
       `INSERT INTO beeper 
        (message, telenum, sendername, type, origin, private, messageid) 
        VALUES 
        ("${mres(message)}", "${mres(telenum)}", "${mres(sendername)}", "${type}", "${origin}", ${prv}, "${mres(messageid)}")`, 
        (err,res,fld)=>{
          broadcast({
            type: 'beepernew',
            data: {
              id: res.insertId,
              message: encodeURIComponent(beepEntities(message)),
              unread: true,
              sender: null,
              crypt: null,
              type: "message",
              ctime: (+ new Date()),
              origin: "sms",
              private: false,
              mention: false,
              reserved: {}
            }
          })
        })
      }
    })
   response.writeHead(204, { 
      "Access-Control-Allow-Origin": "*"
    })
  response.end()
})

beepserver.listen(beepport, function() {
  console.log('Qloppi Mi-Yu paging service working on http://localhost:' + beepport)
})