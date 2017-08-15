// setup

// CREATE TABLE beeper (
//   id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
//   message TEXT,
//   telenum TINYTEXT,
//   sendername TINYTEXT,
//   type TINYTEXT NOT NULL,
//   ctime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   origin TINYTEXT NOT NULL,
//   private BIT(1) NOT NULL
// );

var beeper = {
  
  mode: {
    status: null,
    datetime: false
  },
  
  init: () => {
    // build beeper
    
    
    
    beeper.ui.create()
    // init localstorage settings
    beeper.events.listeners()
    beeper.fs.init()

    // init
    beeper.mode.status = "init"
    beeper.ui.transform()
    
    setTimeout(()=>{
      beeper.ui.display.data.a("Qloppi Mi-Yu")
      beeper.ui.display.data.b("Beeper Service")
      beeper.ui.indiglo.on()
    },300)
    setTimeout(()=>{
      beeper.ui.display.data.a("Your World")
      beeper.ui.display.data.b("Connected.")
      beeper.handler.messages.data.request()
    },3000)
    setTimeout(()=>{
      beeper.ui.indiglo.off()
    },6000)
    setTimeout(()=>{
      $('#beeper').removeClass("disabled")
      beeper.handler.idle.init()
      
    },6800)
    
    // fast on:
    // beeper.ui.transform()
    // beeper.handler.idle.init()
    // $('#beeper').removeClass("disabled")
    // send request to fetch history
    // create events
  },
  
  ui: {
    create: () => {
      $('body').append(
       `<div id="beeper" class="disabled">
          <div class="indigloscreen"></div>
          <div class="ledscreen">
            <div id="beeperleda"></div>
            <div id="beeperledb"></div>
          </div>
          <button class="left"></button>
          <button class="right"></button>
          <button class="up"></button>
          <button class="down"></button>
          <button class="menu"></button>
          <button class="home"></button>
        </div>`
      )
      $(function() {
        $("#beeper").draggable({
          scroll: false
        })
      })
      if (localStorage.getItem("beepertype")) {
        localStorage.removeItem("beepertype")
      }
      if (!localStorage.getItem("neuebeepertype")) {
        localStorage.setItem("neuebeepertype","girl")
      }
      if (localStorage.getItem("neuebeepertype") == "girl" ) {
        $('#beeper').addClass("girl")
      }
    },
    transform: () => {
      if (beeper.fs.data.settings.taehyung) {
        $('#beeper').addClass("taehyung")
      }
      else {
        $('#beeper').removeClass("taehyung")
      }
      if (beeper.fs.data.settings.offsetleft) {
        $('#beeper').css("left",beeper.fs.data.settings.offsetleft)
      }
      if (beeper.fs.data.settings.offsettop) {
        $('#beeper').css("top",beeper.fs.data.settings.offsettop)
      }
    },
    display: {
      feeder: {
        data: {
          message: {
            a: null,
            b: null
          },
          position: {
            a: 0,
            b: 0
          }
        },
        feed: (e, target) => {
          
          beeper.ui.display.feeder.timer.prescroll[target].clear()
          beeper.ui.display.feeder.timer.scroll[target].clear()
          // scroll system 
          // e => message
          // target => a/b
          
          // if length of e is less than 16 no need to scroll
          // e needs to be a string
          e = e.toString()
          beeper.ui.display.feeder.data.position[target] = 0
          
          if (e.length <= 16) {
            beeper.ui.display.data[target](e)
            beeper.ui.display.feeder.data.message[target] = null
            return
          }
          
          beeper.ui.display.feeder.data.message[target] = e
          beeper.ui.display.data[target](e.substring(0,16))
          
          // delay scrolling for a split second before marqueeing
          beeper.ui.display.feeder.timer.prescroll[target].renew()

        },
        
        scroll: (target) => {

          beeper.ui.display.feeder.data.message[target] = beeper.ui.display.feeder.data.message[target].substr(1)
          beeper.ui.display.data[target](beeper.ui.display.feeder.data.message[target].substring(0,16))
          
          // if message hasnt finished scrolling, request a timer          
          if (beeper.ui.display.feeder.data.message[target].length > 16) {
            beeper.ui.display.feeder.timer.scroll[target].renew()
          }
          // otherwise prepare to timeout for idle finish
          
        },
        
        timer: {
          // delay scrolling mechanism
          prescroll: {
            a: {
              data: null,
              clear: () => {
                clearTimeout(beeper.ui.display.feeder.timer.prescroll.a.data)
              },
              renew: () => {
                beeper.ui.display.feeder.timer.prescroll.a.clear()
                beeper.ui.display.feeder.timer.prescroll.a.data = setTimeout(()=> {
                  beeper.ui.display.feeder.scroll("a")
                }, (beeper.fs.data.settings.delay * 300) )
              }
            },
            b: {
              data: null,
              clear: () => {
                clearTimeout(beeper.ui.display.feeder.timer.prescroll.b.data)
              },
              renew: () => {
                beeper.ui.display.feeder.timer.prescroll.b.clear()
                beeper.ui.display.feeder.timer.prescroll.b.data = setTimeout(()=> {
                  beeper.ui.display.feeder.scroll("b")
                }, (beeper.fs.data.settings.delay * 300) )
              }            
            }            
          },
          // start scrolling mechanism
          scroll: {
            a: {
              data: null,
              clear: () => {
                clearTimeout(beeper.ui.display.feeder.timer.scroll.a.data)
              },
              renew: () => {
                beeper.ui.display.feeder.timer.scroll.a.clear();
                beeper.ui.display.feeder.timer.scroll.a.data = setTimeout(() => {
                  beeper.ui.display.feeder.scroll("a")
                }, ((1 * 250) / ((beeper.fs.data.settings.marquee) / 8)) )        
              }
            },
            b: {
              data: null,
              clear: () => {
                clearTimeout(beeper.ui.display.feeder.timer.scroll.b.data)
              },
              renew: () => {
                beeper.ui.display.feeder.timer.scroll.b.clear();
                beeper.ui.display.feeder.timer.scroll.b.data = setTimeout(() => {
                  beeper.ui.display.feeder.scroll("b")
                }, ((1 * 250) / ((beeper.fs.data.settings.marquee) / 8)) )          
              }
            }            
          }
        }
      },
      
      data: {
        a: (e) => {
          $('#beeperleda').text(e)
        },
        b: (e) => {
          $('#beeperledb').text(e)
        }
      },
      power: {
        on: () => {
          
        },
        off: () => {
          
        }
      }
    },
    indiglo: {
      // doubles as home screen
      timer: {
        data: null,
        clear: () => {
          clearTimeout(beeper.ui.indiglo.timer.data)
        },
        renew: () => {
          beeper.ui.indiglo.timer.clear();
          beeper.ui.indiglo.timer.data = setTimeout(() => {
            if (!beeper.fs.data.settings.indiglo) {
              beeper.ui.indiglo.off() 
            }
          //}, 30000)          
          }, beeper.fs.data.settings.timeout * 1000)          
        }
      },
      on: () => {
        $('#beeper .indigloscreen').addClass("on")          
      },
      off: () => {
        beeper.ui.indiglo.timer.clear()
        $('#beeper .indigloscreen').removeClass("flicker")
        $('#beeper .indigloscreen').removeClass("on")        
      },
      flicker: () => {
        beeper.ui.indiglo.timer.renew()
        $('#beeper .indigloscreen').addClass("flicker")
        $('#beeper .indigloscreen').addClass("on")
      }
    },
    sleep: {
      timer: {
        data: null,
        clear: () => {
          clearTimeout(beeper.ui.sleep.timer.data)
        },
        renew: () => {
          beeper.ui.sleep.timer.clear();
          beeper.ui.sleep.timer.data = setTimeout(() => {
            // if its in the messages wait a little longer
            beeper.handler.idle.init()
          //}, 30000)          
          }, beeper.fs.data.settings.timeout * 1000)          
        }
      }
    },
    toggletype: () => {
      if ( $('#beeper').hasClass("girl") ) {
        $('#beeper').removeClass("girl")
        localStorage.setItem("beepertype", "normal")
      }  
      else {
        $('#beeper').addClass("girl")
        localStorage.setItem("beepertype", "girl")
      }
    }
    
    // handle controls
  },
  
  button: {
    
    up: () => {
      
      (({
        settings: () => {
          beeper.handler.settings.control.pitch("up")
        },
        idle: () => {
          if ( beeper.fs.data.messages.length > 0) {
            beeper.handler.messages.init()
          }
        },
        messages: () => {
          beeper.handler.messages.control.pitch("up")
        },        
      })[beeper.mode.status] || (() => {  } ))()      
      
    },
    down: () => {
      
      (({
        settings: () => {
          beeper.handler.settings.control.pitch("down")
        },
        idle: () => {
          if ( beeper.fs.data.messages.length > 0) {
            beeper.handler.messages.init()
          }
        },
        messages: () => {
          beeper.handler.messages.control.pitch("down")
        },
        
      })[beeper.mode.status] || (() => {  } ))()        
      
    },
    left: () => {
      
      (({
        menu: () => {
          beeper.handler.menu.control.left()
        },
        chime: () => {
          beeper.handler.chime.control.left()
        },
        settings: () => {
          beeper.handler.settings.control.left()
        },
        messages: () => {
          beeper.handler.messages.control.left()
        },        
      })[beeper.mode.status] || (() => {  } ))()
      
    },
    right: () => {
      
      (({
        menu: () => {
          beeper.handler.menu.control.right()
        },
        chime: () => {
          beeper.handler.chime.control.right()
        },
        settings: () => {
          beeper.handler.settings.control.right()
        },
        messages: () => {
          beeper.handler.messages.control.right()
        },         
      })[beeper.mode.status] || (() => {  } ))()
      
    },
    menu: () => {
      
      (({
        idle: () => {
          beeper.handler.menu.init()
        },
        menu: () => {
          beeper.handler.menu.control.select()
        },
        chime: () => {
          beeper.handler.chime.control.select()
        },
        settings: () => {
          beeper.handler.settings.control.select()
        }
      })[beeper.mode.status] || (() => {  } ))()
      
    },
    home: () => {
      
      console.log(beeper.mode.status)
      
      if ( beeper.mode.status == "idle" 
        && beeper.fs.data.messages.length > 0 ) {
        beeper.handler.messages.init()
      }
      else {
        
        beeper.handler.idle.init()
      }
      
    },
    
  },
  
  fs: {
    data: {},   
    read: () => {
      beeper.fs.data = JSON.parse(atob(localStorage.getItem("bogbeeper")))
    },
    write: () => {
      localStorage.setItem("bogbeeper", btoa(JSON.stringify(beeper.fs.data)))
    },
    init: () => {
      if (!localStorage.getItem('bogbeeper')) {
        console.log("here")
        localStorage.setItem("bogbeeper", btoa(JSON.stringify({
          settings: {
            chime:      2,
            timeout:    30,
            marquee:    10,
            delay:      4,
            indiglo:    false,
            autoopen:   false,
            taehyung:   false,
            daytime:    false,
            offsetleft: null,
            offsettop:  null,
          },
          messages: []
        })))
      }
      beeper.fs.read()
      
    }
    
  },
  
  navigation: {
    
    display: (e) => {
      var active = beeper.handler[e].data.active
      beeper.ui.display.data.a(beeper.handler[e].data.options[active].label)
      beeper.ui.display.data.b(beeper.handler[e].data.options[active].glyph)        
    },
    
    control: (e) => {
      if (beeper.handler[e].data.active < 0 ) {
        beeper.handler[e].data.active = beeper.handler[e].data.options.length - 1
      }
      else if (beeper.handler[e].data.active > (beeper.handler[e].data.options.length - 1) ) {
        beeper.handler[e].data.active = 0
      }
      beeper.navigation.display(e)
    }
    
  },  
  
  handler: {
 
    idle: {
      
      init: () => {
        // clear all active scrolling timers
        beeper.ui.display.feeder.timer.prescroll.a.clear()
        beeper.ui.display.feeder.timer.prescroll.b.clear()
        beeper.ui.display.feeder.timer.scroll.a.clear()
        beeper.ui.display.feeder.timer.scroll.b.clear()

        beeper.mode.status = "idle"
        beeper.handler.messages.data.unread.calculate() 
      }
      
    },
   
    menu: {
      
      data: {
        
        active: null,
        options: [
          {
            label: "choose alert",
            glyph: "♫",
          },
          {
            label: "settings",
            glyph: "☼",
          },
          {
            label: "escape",
            glyph: "↔",
          }
        ]
      },
      
      init: () => {
        
        beeper.mode.status = "menu"
        beeper.handler.menu.data.active = 2
        beeper.navigation.display(beeper.mode.status)
        
      },
            
      control: {
      
        select: () => {
          
          (({
            "choose alert": () => {
              beeper.handler.chime.init()
            },
            "settings": () => {
              beeper.handler.settings.init()
            },
            "escape": () => {
              beeper.handler.idle.init()
            },
          })[beeper.handler[beeper.mode.status].data.options[beeper.handler[beeper.mode.status].data.active].label])()
          
        },
        
        left: () => {
          
          beeper.handler.menu.data.active--
          beeper.navigation.control(beeper.mode.status)
          
        },
        
        right: () => {
          
          beeper.handler.menu.data.active++
          beeper.navigation.control(beeper.mode.status)
          
        }
      
      }
      
    },
    
    messages: {
      
      data: {

        request: () => {
          send({type: "beeperhistoryrequest"})
        },
      
        history: (x) => {
          // response array of old messages
          for ( var e=0; e < x.length; e++ ) {
            beeper.handler.messages.data.upsert(x[e])
          }
          beeper.handler.messages.data.unread.calculate()
          
        },
        
        incoming: (e) => {
          
          // dont display 'new message' unless the phone is idle.
          beeper.handler.messages.data.upsert(e)
          beeper.ui.indiglo.flicker()
          if (beeper.mode.status == "idle") {
            beeper.ui.display.data.a("new message")
            beeper.ui.display.data.b("")
          }
          if (beeper.mode.status != "chime") {
            beeper.handler.chime.tone.play(true)
          }
          setTimeout(() => {
            beeper.handler.messages.data.unread.calculate()
            if (beeper.mode.status == "idle" && beeper.fs.data.autoopen) {
              beeper.handler.messages.init()
            }
          },1000)
          
          // real-time individual new message + chirp
          // then timeout to idle
          // 
        },
        
        upsert: (e) => {
          
          // snub message > 200 char length and make safe for html
          // dump old messages > 500 messages in book
          if ( $.grep(beeper.fs.data.messages, (x) => { return x.id === e.id }).length === 0 ) {
            beeper.fs.data.messages.push(e)
            if ( beeper.fs.data.messages.length >= 398 ) {
              beeper.fs.data.messages.shift()
            }
            beeper.fs.write()
          }
          // otherwise snub.. already exists in history
        },
        
        unread: {
          
          count: 0,
          calculate: () => {
            var unread = 0
            for (var e=0;e<beeper.fs.data.messages.length;e++) {
              if ( beeper.fs.data.messages[e].unread ) {
                unread++
              }
            }
            beeper.handler.messages.data.unread.count = unread
            beeper.handler.messages.data.unread.display()
          },
          display: () => {
            if (beeper.mode.status == "idle") {
              beeper.ui.display.data.a("☺")
              var unread = beeper.handler.messages.data.unread.count
              var total = beeper.fs.data.messages.length
              beeper.ui.display.data.b(`${unread}/${total}`)
            }
          }
          
        }        
       
      },
      
      inbox: {
        
        count: 0,
        data: null,
        toggler: {
          status: null,
          datetime: null,
          toggle: () => {
            beeper.mode.datetime = !beeper.mode.datetime
            beeper.handler.messages.inbox.toggler.display()
          },
          display: () => {
            if (beeper.mode.datetime) {
              beeper.ui.display.data.a(beeper.handler.messages.inbox.toggler.datetime)
            }
            else {
              beeper.ui.display.data.a(beeper.handler.messages.inbox.toggler.status)  
            }            
          }
        },
        display: () => {
          
          // display current count
          
          var e = beeper.handler.messages.inbox.data[beeper.handler.messages.inbox.count]
          var stat = ( e.unread == true ) ? "◘" : " "
          var id = e.id
          // keep inbox message set to unread but make it read in the filesystem
          // update fs
          var p = 0
          $.grep(beeper.fs.data.messages, (x) => {
            p++
            if ( x.id === e.id ) {
              beeper.fs.data.messages[p - 1].unread = false
              beeper.fs.write()
            } 
          })
          // grep message in fs and mark as unread..
          // reason for splitting master fs and inbox fs is if someone sends a message
          // while youre in the message area.. dont want to interrupt the live count
          var count = beeper.handler.messages.inbox.count + 1
          var total = beeper.handler.messages.inbox.data.length
          var tl = total.toString().length
          var cl = count.toString().length
          var sp = " ".repeat(16 - (4 + cl))

          if (beeper.handler.messages.inbox.data.length - 1 == 0) {
            var direction = "↨"
          }
          else if (beeper.handler.messages.inbox.count >= beeper.handler.messages.inbox.data.length - 1) {
            var direction = "↓"
          }
          else if (beeper.handler.messages.inbox.count <= 0) {
            var direction = "↑"
          }
          else {
            var direction = "↕"
          }
          // build datetime
          var ctime = e.ctime
          var month = ("0" + (new Date(ctime).getMonth() + 1)).slice(-2)
          var day = ("0" + new Date(ctime).getDate()).slice(-2)
          var hour = ("0" + new Date(ctime).getHours()).slice(-2)
          var minute = ("0" + new Date(ctime).getMinutes()).slice(-2)

          
          beeper.handler.messages.inbox.toggler.datetime = `>${stat} ${month}/${day} ${hour}:${minute} ${direction}`
          beeper.handler.messages.inbox.toggler.status = `>${stat}${sp}${count} ${direction}`
          beeper.handler.messages.inbox.toggler.display()
          
          beeper.ui.display.feeder.feed(decodeURIComponent(e.message), "b")
        },        
      },      
      
      init: () => {
        
        beeper.mode.status = "messages"
        
        // build message array to be viewed
        beeper.handler.messages.inbox.data = beeper.fs.data.messages
        // count needs to be the number of messages to start.. prevent from going into inf/-1 with limiter
        beeper.handler.messages.inbox.count = beeper.fs.data.messages.length - 1
        
        beeper.handler.messages.inbox.display()
        
      },
      
      control: {
        
        pitch: (y) => {
          
          (({
            "up": () => {
              if (beeper.handler.messages.inbox.count >= beeper.fs.data.messages.length - 1 ) {
                return
              }
              else {
                beeper.handler.messages.inbox.count++
              }
            },
            "down": () => {
              if (beeper.handler.messages.inbox.count <= 0 ) {
                return
              }
              else {
                beeper.handler.messages.inbox.count--
              }
            }
          })[y])();
          beeper.handler.messages.inbox.display()
        },
        
        left: () => {
          beeper.handler.messages.inbox.toggler.toggle()
        },
        right: () => {
          beeper.handler.messages.inbox.toggler.toggle()
        },
        
      },
      
      
    },
    
    chime: {
      
      tone: {
        
        data: null,
        play: (newmessage) => {
          if (newmessage) {
            var sound = beeper.fs.data.settings.chime
          }
          else {
            var sound = beeper.handler.chime.data.active
          }
          if (beeper.handler.chime.tone.data) {
            beeper.handler.chime.tone.data.pause()
          }
          if ( beeper.handler.chime.data.options[sound].label != "silent" ) {
            beeper.handler.chime.tone.data = new Audio(`https://bog.jollo.org/au/beeper/${sound}.wav`)
            beeper.handler.chime.tone.data.play()
          }
        }
      },

      data: {
        
        active: 0,
        options: [
          {
            label: "standard alert",
            glyph: "1",
          },
          {
            label: "pleasing alert",
            glyph: "2",
          },
          {
            label: "pleasing alert",
            glyph: "3",
          },
          {
            label: "pleasing alert",
            glyph: "4",
          },
          {
            label: "pleasing alert",
            glyph: "5",
          },
          {
            label: "chirp alert",
            glyph: "6",
          },
          {
            label: "vibrate",
            glyph: "7",
          },
          {
            label: "silent",
            glyph: "8",
          }
        ]
      },  
    
      init: () => {
        
        beeper.mode.status = "chime"
        beeper.handler.chime.data.active = beeper.fs.data.settings.chime
        beeper.navigation.display(beeper.mode.status)
        
      },
      
      control: {
      
        select: () => {
          beeper.fs.data.settings.chime = beeper.handler.chime.data.active
          beeper.fs.write()
          beeper.handler.chime.tone.play()
          beeper.handler.idle.init()
        },
        
        left: () => {
          beeper.handler.chime.data.active--
          beeper.navigation.control(beeper.mode.status)
          beeper.handler.chime.tone.play()
        },
        
        right: () => {
          beeper.handler.chime.data.active++
          beeper.navigation.control(beeper.mode.status)
          beeper.handler.chime.tone.play()
        }
      
      }      

    },
    
    settings: {
      
      data: {
        
        active: null,
        options: [
          {
            name: "indiglo",
            label: "indiglo stay on",
            glyph: null,
          },
          {
            name: "timeout",
            label: "idle timeout",
            glyph: null,
          },
          {
            name: "marquee",
            label: "marquee speed",
            glyph: null,
          },
          {
            name: "delay",
            label: "marquee delay",
            glyph: null,
          },
          {
            name: "autoopen",
            label: "open on receive",
            glyph: null,
          },
          {
            name: "taehyung",
            label: "taehyung mode",
            glyph: null,
          },
          {
            name: "daytime",
            label: "daytime indiglo",
            glyph: null,
          }
        ]
      },      
      
      init: () => {
        beeper.mode.status = "settings"
        beeper.handler.settings.data.active = 6
        // build settings menu
        for (var e = 0; e < beeper.handler.settings.data.options.length; e++ ) {
          var name = beeper.handler.settings.data.options[e].name
          var fsdata = beeper.fs.data.settings[name]
          beeper.handler.settings.data.options[e].glyph = fsdata
        }
        beeper.navigation.display(beeper.mode.status)
      },
      
      control: {
        select: () => {
          // save menu settings to fs
          for (var e = 0; e < beeper.handler.settings.data.options.length; e++ ) {
            var name = beeper.handler.settings.data.options[e].name
            var selectdata = beeper.handler.settings.data.options[e].glyph
            beeper.fs.data.settings[name] = selectdata
          }
          beeper.fs.write()
          // evaluate taehyung mode change
          beeper.ui.transform()
          beeper.ui.indiglo.timer.clear()
          $('#beeper').addClass("disabled")
          beeper.ui.display.data.a("settings")
          beeper.ui.display.data.b("saved")          
          setTimeout(()=>{
            $('#beeper').removeClass("disabled")
            beeper.handler.idle.init()
          },750)
        },
        
        left: () => {
          beeper.handler.settings.data.active--
          beeper.navigation.control(beeper.mode.status)
        },
        
        right: () => {
          beeper.handler.settings.data.active++
          beeper.navigation.control(beeper.mode.status)
        },
        
        pitch: (y) => {
          
          // y is up/down
          (({
            "indiglo stay on": () => {
              beeper.handler.settings.data.options[0].glyph = !beeper.handler.settings.data.options[0].glyph
            },
            "idle timeout": () => {
              var glyph = beeper.handler.settings.data.options[1].glyph
              beeper.handler.settings.data.options[1].glyph = (y == "up") ? glyph + 2 : glyph - 2
              if (beeper.handler.settings.data.options[1].glyph <= 6) {
                beeper.handler.settings.data.options[1].glyph = 6
              }
              else if (beeper.handler.settings.data.options[1].glyph >= 120) {
                beeper.handler.settings.data.options[1].glyph = 120
              }
            },
            "marquee speed": () => {
              var glyph = beeper.handler.settings.data.options[2].glyph
              beeper.handler.settings.data.options[2].glyph = (y == "up") ? glyph + 1 : glyph - 1
              if (beeper.handler.settings.data.options[2].glyph <= 1) {
                beeper.handler.settings.data.options[2].glyph = 1
              }
              else if (beeper.handler.settings.data.options[2].glyph >= 40) {
                beeper.handler.settings.data.options[2].glyph = 40
              }
            },
            "marquee delay": () => {
              var glyph = beeper.handler.settings.data.options[3].glyph
              beeper.handler.settings.data.options[3].glyph = (y == "up") ? glyph + 1 : glyph - 1
              if (beeper.handler.settings.data.options[3].glyph <= 1) {
                beeper.handler.settings.data.options[3].glyph = 1
              }
              else if (beeper.handler.settings.data.options[3].glyph >= 10) {
                beeper.handler.settings.data.options[3].glyph = 10
              }
            },
            "open on receive": () => {
              beeper.handler.settings.data.options[4].glyph = !beeper.handler.settings.data.options[4].glyph
            },
            "taehyung mode": () => {
              beeper.handler.settings.data.options[5].glyph = !beeper.handler.settings.data.options[5].glyph
            },
            "daytime indiglo": () => {
              beeper.handler.settings.data.options[6].glyph = !beeper.handler.settings.data.options[6].glyph
            },
            
          })[beeper.handler[beeper.mode.status].data.options[beeper.handler[beeper.mode.status].data.active].label] || (() => {  } ))()
          beeper.navigation.display(beeper.mode.status)
          
        }
      
      }        
      
    },
    
    // handle messages
    // indiglo QLOPPI Mi-Yu always-on(tm) technology
    
  },
  
  events: {
    drag: false,
    listeners: () => {
      $(document).on('click','#beeper button',(e)=>{
        // kill message scrolling with beeper.ui.display.feeder.timer.b.clear()
        // handle delay in going back to the idle screen
        beeper.ui.sleep.timer.renew()
        // handle night time indiglo
        if ( $('html').hasClass("night") || beeper.fs.data.settings.daytime ) {
          beeper.ui.indiglo.timer.renew()
          beeper.ui.indiglo.on()
        }
        beeper.button[e.currentTarget.classList.value]()
      })
      $(document).on('mousedown','#beeper',()=>{
        beeper.events.drag = false
      })
      $(document).on('mousemove','#beeper',()=>{
        beeper.events.drag = true
      })
      $(document).on('mouseup','#beeper',()=>{
        if (beeper.events.drag) {
          beeper.fs.data.settings.offsetleft = $('#beeper').offset().left
          beeper.fs.data.settings.offsettop = $('#beeper').offset().top
          beeper.fs.write()
        }
        beeper.events.drag = false
      })
    }
  }
  
}

beeper.init()
