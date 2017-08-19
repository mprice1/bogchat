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

bog.beeper = {
  
  mode: {
    status: null,
    datetime: false
  },
  
  init: () => {
    // build beeper
    
    bog.beeper.ui.create()
    // init localstorage settings
    bog.beeper.events.listeners()
    bog.beeper.fs.init()

    // init
    bog.beeper.mode.status = "init"
    bog.beeper.ui.transform()
    
    setTimeout(()=>{
      bog.beeper.ui.display.data.a("Qloppi Mi-Yu")
      bog.beeper.ui.display.data.b("Beeper Service")
      bog.beeper.ui.indiglo.on()
    },300)
    setTimeout(()=>{
      bog.beeper.ui.display.data.a("Your World")
      bog.beeper.ui.display.data.b("Connected.")
      bog.beeper.handler.messages.data.request()
    },3000)
    setTimeout(()=>{
      bog.beeper.ui.indiglo.off()
    },6000)
    setTimeout(()=>{
      $('#beeper').removeClass("disabled")
      bog.beeper.handler.idle.init()
      
    },6800)
    
    // fast on:
    // bog.beeper.ui.transform()
    // bog.beeper.handler.idle.init()
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
      if (bog.beeper.fs.data.settings.taehyung) {
        $('#beeper').addClass("taehyung")
      }
      else {
        $('#beeper').removeClass("taehyung")
      }
      if (bog.beeper.fs.data.settings.offsetleft) {
        $('#beeper').css("left",bog.beeper.fs.data.settings.offsetleft)
      }
      if (bog.beeper.fs.data.settings.offsettop) {
        $('#beeper').css("top",bog.beeper.fs.data.settings.offsettop)
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
          
          bog.beeper.ui.display.feeder.timer.prescroll[target].clear()
          bog.beeper.ui.display.feeder.timer.scroll[target].clear()
          // scroll system 
          // e => message
          // target => a/b
          
          // if length of e is less than 16 no need to scroll
          // e needs to be a string
          e = e.toString()
          bog.beeper.ui.display.feeder.data.position[target] = 0
          
          if (e.length <= 16) {
            bog.beeper.ui.display.data[target](e)
            bog.beeper.ui.display.feeder.data.message[target] = null
            return
          }
          
          bog.beeper.ui.display.feeder.data.message[target] = e
          bog.beeper.ui.display.data[target](e.substring(0,16))
          
          // delay scrolling for a split second before marqueeing
          bog.beeper.ui.display.feeder.timer.prescroll[target].renew()

        },
        
        scroll: (target) => {

          bog.beeper.ui.display.feeder.data.message[target] = bog.beeper.ui.display.feeder.data.message[target].substr(1)
          bog.beeper.ui.display.data[target](bog.beeper.ui.display.feeder.data.message[target].substring(0,16))
          
          // if message hasnt finished scrolling, request a timer          
          if (bog.beeper.ui.display.feeder.data.message[target].length > 16) {
            bog.beeper.ui.display.feeder.timer.scroll[target].renew()
          }
          // otherwise prepare to timeout for idle finish
          
        },
        
        timer: {
          // delay scrolling mechanism
          prescroll: {
            a: {
              data: null,
              clear: () => {
                clearTimeout(bog.beeper.ui.display.feeder.timer.prescroll.a.data)
              },
              renew: () => {
                bog.beeper.ui.display.feeder.timer.prescroll.a.clear()
                bog.beeper.ui.display.feeder.timer.prescroll.a.data = setTimeout(()=> {
                  bog.beeper.ui.display.feeder.scroll("a")
                }, (bog.beeper.fs.data.settings.delay * 300) )
              }
            },
            b: {
              data: null,
              clear: () => {
                clearTimeout(bog.beeper.ui.display.feeder.timer.prescroll.b.data)
              },
              renew: () => {
                bog.beeper.ui.display.feeder.timer.prescroll.b.clear()
                bog.beeper.ui.display.feeder.timer.prescroll.b.data = setTimeout(()=> {
                  bog.beeper.ui.display.feeder.scroll("b")
                }, (bog.beeper.fs.data.settings.delay * 300) )
              }            
            }            
          },
          // start scrolling mechanism
          scroll: {
            a: {
              data: null,
              clear: () => {
                clearTimeout(bog.beeper.ui.display.feeder.timer.scroll.a.data)
              },
              renew: () => {
                bog.beeper.ui.display.feeder.timer.scroll.a.clear();
                bog.beeper.ui.display.feeder.timer.scroll.a.data = setTimeout(() => {
                  bog.beeper.ui.display.feeder.scroll("a")
                }, ((1 * 250) / ((bog.beeper.fs.data.settings.marquee) / 8)) )        
              }
            },
            b: {
              data: null,
              clear: () => {
                clearTimeout(bog.beeper.ui.display.feeder.timer.scroll.b.data)
              },
              renew: () => {
                bog.beeper.ui.display.feeder.timer.scroll.b.clear();
                bog.beeper.ui.display.feeder.timer.scroll.b.data = setTimeout(() => {
                  bog.beeper.ui.display.feeder.scroll("b")
                }, ((1 * 250) / ((bog.beeper.fs.data.settings.marquee) / 8)) )          
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
          clearTimeout(bog.beeper.ui.indiglo.timer.data)
        },
        renew: () => {
          bog.beeper.ui.indiglo.timer.clear();
          bog.beeper.ui.indiglo.timer.data = setTimeout(() => {
            if (!bog.beeper.fs.data.settings.indiglo) {
              bog.beeper.ui.indiglo.off() 
            }
          //}, 30000)          
          }, bog.beeper.fs.data.settings.timeout * 1000)          
        }
      },
      on: () => {
        $('#beeper .indigloscreen').addClass("on")          
      },
      off: () => {
        bog.beeper.ui.indiglo.timer.clear()
        $('#beeper .indigloscreen').removeClass("flicker")
        $('#beeper .indigloscreen').removeClass("on")        
      },
      flicker: () => {
        bog.beeper.ui.indiglo.timer.renew()
        $('#beeper .indigloscreen').addClass("flicker")
        $('#beeper .indigloscreen').addClass("on")
      }
    },
    sleep: {
      timer: {
        data: null,
        clear: () => {
          clearTimeout(bog.beeper.ui.sleep.timer.data)
        },
        renew: () => {
          bog.beeper.ui.sleep.timer.clear();
          bog.beeper.ui.sleep.timer.data = setTimeout(() => {
            // if its in the messages wait a little longer
            bog.beeper.handler.idle.init()
          //}, 30000)          
          }, bog.beeper.fs.data.settings.timeout * 1000)          
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
          bog.beeper.handler.settings.control.pitch("up")
        },
        idle: () => {
          if ( bog.beeper.fs.data.messages.length > 0) {
            bog.beeper.handler.messages.init()
          }
        },
        messages: () => {
          bog.beeper.handler.messages.control.pitch("up")
        },        
      })[bog.beeper.mode.status] || (() => {  } ))()      
      
    },
    down: () => {
      
      (({
        settings: () => {
          bog.beeper.handler.settings.control.pitch("down")
        },
        idle: () => {
          if ( bog.beeper.fs.data.messages.length > 0) {
            bog.beeper.handler.messages.init()
          }
        },
        messages: () => {
          bog.beeper.handler.messages.control.pitch("down")
        },
        
      })[bog.beeper.mode.status] || (() => {  } ))()        
      
    },
    left: () => {
      
      (({
        menu: () => {
          bog.beeper.handler.menu.control.left()
        },
        chime: () => {
          bog.beeper.handler.chime.control.left()
        },
        settings: () => {
          bog.beeper.handler.settings.control.left()
        },
        messages: () => {
          bog.beeper.handler.messages.control.left()
        },        
      })[bog.beeper.mode.status] || (() => {  } ))()
      
    },
    right: () => {
      
      (({
        menu: () => {
          bog.beeper.handler.menu.control.right()
        },
        chime: () => {
          bog.beeper.handler.chime.control.right()
        },
        settings: () => {
          bog.beeper.handler.settings.control.right()
        },
        messages: () => {
          bog.beeper.handler.messages.control.right()
        },         
      })[bog.beeper.mode.status] || (() => {  } ))()
      
    },
    menu: () => {
      
      (({
        idle: () => {
          bog.beeper.handler.menu.init()
        },
        menu: () => {
          bog.beeper.handler.menu.control.select()
        },
        chime: () => {
          bog.beeper.handler.chime.control.select()
        },
        settings: () => {
          bog.beeper.handler.settings.control.select()
        }
      })[bog.beeper.mode.status] || (() => {  } ))()
      
    },
    home: () => {
      
      console.log(bog.beeper.mode.status)
      
      if ( bog.beeper.mode.status == "idle" 
        && bog.beeper.fs.data.messages.length > 0 ) {
        bog.beeper.handler.messages.init()
      }
      else {
        
        bog.beeper.handler.idle.init()
      }
      
    },
    
  },
  
  fs: {
    data: {},   
    read: () => {
      bog.beeper.fs.data = JSON.parse(atob(localStorage.getItem("bogbeeper")))
    },
    write: () => {
      localStorage.setItem("bogbeeper", btoa(JSON.stringify(bog.beeper.fs.data)))
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
      bog.beeper.fs.read()
      
    }
    
  },
  
  navigation: {
    
    display: (e) => {
      var active = bog.beeper.handler[e].data.active
      bog.beeper.ui.display.data.a(bog.beeper.handler[e].data.options[active].label)
      bog.beeper.ui.display.data.b(bog.beeper.handler[e].data.options[active].glyph)        
    },
    
    control: (e) => {
      if (bog.beeper.handler[e].data.active < 0 ) {
        bog.beeper.handler[e].data.active = bog.beeper.handler[e].data.options.length - 1
      }
      else if (bog.beeper.handler[e].data.active > (bog.beeper.handler[e].data.options.length - 1) ) {
        bog.beeper.handler[e].data.active = 0
      }
      bog.beeper.navigation.display(e)
    }
    
  },  
  
  handler: {
 
    idle: {
      
      init: () => {
        // clear all active scrolling timers
        bog.beeper.ui.display.feeder.timer.prescroll.a.clear()
        bog.beeper.ui.display.feeder.timer.prescroll.b.clear()
        bog.beeper.ui.display.feeder.timer.scroll.a.clear()
        bog.beeper.ui.display.feeder.timer.scroll.b.clear()

        bog.beeper.mode.status = "idle"
        bog.beeper.handler.messages.data.unread.calculate() 
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
        
        bog.beeper.mode.status = "menu"
        bog.beeper.handler.menu.data.active = 2
        bog.beeper.navigation.display(bog.beeper.mode.status)
        
      },
            
      control: {
      
        select: () => {
          
          (({
            "choose alert": () => {
              bog.beeper.handler.chime.init()
            },
            "settings": () => {
              bog.beeper.handler.settings.init()
            },
            "escape": () => {
              bog.beeper.handler.idle.init()
            },
          })[bog.beeper.handler[bog.beeper.mode.status].data.options[bog.beeper.handler[bog.beeper.mode.status].data.active].label])()
          
        },
        
        left: () => {
          
          bog.beeper.handler.menu.data.active--
          bog.beeper.navigation.control(bog.beeper.mode.status)
          
        },
        
        right: () => {
          
          bog.beeper.handler.menu.data.active++
          bog.beeper.navigation.control(bog.beeper.mode.status)
          
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
            bog.beeper.handler.messages.data.upsert(x[e])
          }
          bog.beeper.handler.messages.data.unread.calculate()
          
        },
        
        incoming: (e) => {
          
          // dont display 'new message' unless the phone is idle.
          bog.beeper.handler.messages.data.upsert(e)
          bog.beeper.ui.indiglo.flicker()
          if (bog.beeper.mode.status == "idle") {
            bog.beeper.ui.display.data.a("new message")
            bog.beeper.ui.display.data.b("")
          }
          if (bog.beeper.mode.status != "chime") {
            bog.beeper.handler.chime.tone.play(true)
          }
          setTimeout(() => {
            bog.beeper.handler.messages.data.unread.calculate()
            if (bog.beeper.mode.status == "idle" && bog.beeper.fs.data.autoopen) {
              bog.beeper.handler.messages.init()
            }
          },1000)
          
          // real-time individual new message + chirp
          // then timeout to idle
          // 
        },
        
        upsert: (e) => {
          
          // snub message > 200 char length and make safe for html
          // dump old messages > 500 messages in book
          if ( $.grep(bog.beeper.fs.data.messages, (x) => { return x.id === e.id }).length === 0 ) {
            bog.beeper.fs.data.messages.push(e)
            if ( bog.beeper.fs.data.messages.length >= 398 ) {
              bog.beeper.fs.data.messages.shift()
            }
            bog.beeper.fs.write()
          }
          // otherwise snub.. already exists in history
        },
        
        unread: {
          
          count: 0,
          calculate: () => {
            var unread = 0
            for (var e=0;e<bog.beeper.fs.data.messages.length;e++) {
              if ( bog.beeper.fs.data.messages[e].unread ) {
                unread++
              }
            }
            bog.beeper.handler.messages.data.unread.count = unread
            bog.beeper.handler.messages.data.unread.display()
          },
          display: () => {
            if (bog.beeper.mode.status == "idle") {
              bog.beeper.ui.display.data.a("☺")
              var unread = bog.beeper.handler.messages.data.unread.count
              var total = bog.beeper.fs.data.messages.length
              bog.beeper.ui.display.data.b(`${unread}/${total}`)
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
            bog.beeper.mode.datetime = !bog.beeper.mode.datetime
            bog.beeper.handler.messages.inbox.toggler.display()
          },
          display: () => {
            if (bog.beeper.mode.datetime) {
              bog.beeper.ui.display.data.a(bog.beeper.handler.messages.inbox.toggler.datetime)
            }
            else {
              bog.beeper.ui.display.data.a(bog.beeper.handler.messages.inbox.toggler.status)  
            }            
          }
        },
        display: () => {
          
          // display current count
          
          var e = bog.beeper.handler.messages.inbox.data[bog.beeper.handler.messages.inbox.count]
          var stat = ( e.unread == true ) ? "◘" : " "
          var id = e.id
          // keep inbox message set to unread but make it read in the filesystem
          // update fs
          var p = 0
          $.grep(bog.beeper.fs.data.messages, (x) => {
            p++
            if ( x.id === e.id ) {
              bog.beeper.fs.data.messages[p - 1].unread = false
              bog.beeper.fs.write()
            } 
          })
          // grep message in fs and mark as unread..
          // reason for splitting master fs and inbox fs is if someone sends a message
          // while youre in the message area.. dont want to interrupt the live count
          var count = bog.beeper.handler.messages.inbox.count + 1
          var total = bog.beeper.handler.messages.inbox.data.length
          var tl = total.toString().length
          var cl = count.toString().length
          var sp = " ".repeat(16 - (4 + cl))

          if (bog.beeper.handler.messages.inbox.data.length - 1 == 0) {
            var direction = "↨"
          }
          else if (bog.beeper.handler.messages.inbox.count >= bog.beeper.handler.messages.inbox.data.length - 1) {
            var direction = "↓"
          }
          else if (bog.beeper.handler.messages.inbox.count <= 0) {
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

          
          bog.beeper.handler.messages.inbox.toggler.datetime = `>${stat} ${month}/${day} ${hour}:${minute} ${direction}`
          bog.beeper.handler.messages.inbox.toggler.status = `>${stat}${sp}${count} ${direction}`
          bog.beeper.handler.messages.inbox.toggler.display()
          
          bog.beeper.ui.display.feeder.feed(decodeURIComponent(e.message), "b")
        },        
      },      
      
      init: () => {
        
        bog.beeper.mode.status = "messages"
        
        // build message array to be viewed
        bog.beeper.handler.messages.inbox.data = bog.beeper.fs.data.messages
        // count needs to be the number of messages to start.. prevent from going into inf/-1 with limiter
        bog.beeper.handler.messages.inbox.count = bog.beeper.fs.data.messages.length - 1
        
        bog.beeper.handler.messages.inbox.display()
        
      },
      
      control: {
        
        pitch: (y) => {
          
          (({
            "up": () => {
              if (bog.beeper.handler.messages.inbox.count >= bog.beeper.fs.data.messages.length - 1 ) {
                return
              }
              else {
                bog.beeper.handler.messages.inbox.count++
              }
            },
            "down": () => {
              if (bog.beeper.handler.messages.inbox.count <= 0 ) {
                return
              }
              else {
                bog.beeper.handler.messages.inbox.count--
              }
            }
          })[y])();
          bog.beeper.handler.messages.inbox.display()
        },
        
        left: () => {
          bog.beeper.handler.messages.inbox.toggler.toggle()
        },
        right: () => {
          bog.beeper.handler.messages.inbox.toggler.toggle()
        },
        
      },
      
      
    },
    
    chime: {
      
      tone: {
        
        data: null,
        play: (newmessage) => {
          if (newmessage) {
            var sound = bog.beeper.fs.data.settings.chime
          }
          else {
            var sound = bog.beeper.handler.chime.data.active
          }
          if (bog.beeper.handler.chime.tone.data) {
            bog.beeper.handler.chime.tone.data.pause()
          }
          if ( bog.beeper.handler.chime.data.options[sound].label != "silent" ) {
            bog.beeper.handler.chime.tone.data = new Audio(`https://bog.jollo.org/au/beeper/${sound}.wav`)
            bog.beeper.handler.chime.tone.data.play()
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
        
        bog.beeper.mode.status = "chime"
        bog.beeper.handler.chime.data.active = bog.beeper.fs.data.settings.chime
        bog.beeper.navigation.display(bog.beeper.mode.status)
        
      },
      
      control: {
      
        select: () => {
          bog.beeper.fs.data.settings.chime = bog.beeper.handler.chime.data.active
          bog.beeper.fs.write()
          bog.beeper.handler.chime.tone.play()
          bog.beeper.handler.idle.init()
        },
        
        left: () => {
          bog.beeper.handler.chime.data.active--
          bog.beeper.navigation.control(bog.beeper.mode.status)
          bog.beeper.handler.chime.tone.play()
        },
        
        right: () => {
          bog.beeper.handler.chime.data.active++
          bog.beeper.navigation.control(bog.beeper.mode.status)
          bog.beeper.handler.chime.tone.play()
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
        bog.beeper.mode.status = "settings"
        bog.beeper.handler.settings.data.active = 6
        // build settings menu
        for (var e = 0; e < bog.beeper.handler.settings.data.options.length; e++ ) {
          var name = bog.beeper.handler.settings.data.options[e].name
          var fsdata = bog.beeper.fs.data.settings[name]
          bog.beeper.handler.settings.data.options[e].glyph = fsdata
        }
        bog.beeper.navigation.display(bog.beeper.mode.status)
      },
      
      control: {
        select: () => {
          // save menu settings to fs
          for (var e = 0; e < bog.beeper.handler.settings.data.options.length; e++ ) {
            var name = bog.beeper.handler.settings.data.options[e].name
            var selectdata = bog.beeper.handler.settings.data.options[e].glyph
            bog.beeper.fs.data.settings[name] = selectdata
          }
          bog.beeper.fs.write()
          // evaluate taehyung mode change
          bog.beeper.ui.transform()
          bog.beeper.ui.indiglo.timer.clear()
          $('#beeper').addClass("disabled")
          bog.beeper.ui.display.data.a("settings")
          bog.beeper.ui.display.data.b("saved")          
          setTimeout(()=>{
            $('#beeper').removeClass("disabled")
            bog.beeper.handler.idle.init()
          },750)
        },
        
        left: () => {
          bog.beeper.handler.settings.data.active--
          bog.beeper.navigation.control(bog.beeper.mode.status)
        },
        
        right: () => {
          bog.beeper.handler.settings.data.active++
          bog.beeper.navigation.control(bog.beeper.mode.status)
        },
        
        pitch: (y) => {
          
          // y is up/down
          (({
            "indiglo stay on": () => {
              bog.beeper.handler.settings.data.options[0].glyph = !bog.beeper.handler.settings.data.options[0].glyph
            },
            "idle timeout": () => {
              var glyph = bog.beeper.handler.settings.data.options[1].glyph
              bog.beeper.handler.settings.data.options[1].glyph = (y == "up") ? glyph + 2 : glyph - 2
              if (bog.beeper.handler.settings.data.options[1].glyph <= 6) {
                bog.beeper.handler.settings.data.options[1].glyph = 6
              }
              else if (bog.beeper.handler.settings.data.options[1].glyph >= 120) {
                bog.beeper.handler.settings.data.options[1].glyph = 120
              }
            },
            "marquee speed": () => {
              var glyph = bog.beeper.handler.settings.data.options[2].glyph
              bog.beeper.handler.settings.data.options[2].glyph = (y == "up") ? glyph + 1 : glyph - 1
              if (bog.beeper.handler.settings.data.options[2].glyph <= 1) {
                bog.beeper.handler.settings.data.options[2].glyph = 1
              }
              else if (bog.beeper.handler.settings.data.options[2].glyph >= 40) {
                bog.beeper.handler.settings.data.options[2].glyph = 40
              }
            },
            "marquee delay": () => {
              var glyph = bog.beeper.handler.settings.data.options[3].glyph
              bog.beeper.handler.settings.data.options[3].glyph = (y == "up") ? glyph + 1 : glyph - 1
              if (bog.beeper.handler.settings.data.options[3].glyph <= 1) {
                bog.beeper.handler.settings.data.options[3].glyph = 1
              }
              else if (bog.beeper.handler.settings.data.options[3].glyph >= 10) {
                bog.beeper.handler.settings.data.options[3].glyph = 10
              }
            },
            "open on receive": () => {
              bog.beeper.handler.settings.data.options[4].glyph = !bog.beeper.handler.settings.data.options[4].glyph
            },
            "taehyung mode": () => {
              bog.beeper.handler.settings.data.options[5].glyph = !bog.beeper.handler.settings.data.options[5].glyph
            },
            "daytime indiglo": () => {
              bog.beeper.handler.settings.data.options[6].glyph = !bog.beeper.handler.settings.data.options[6].glyph
            },
            
          })[bog.beeper.handler[bog.beeper.mode.status].data.options[bog.beeper.handler[bog.beeper.mode.status].data.active].label] || (() => {  } ))()
          bog.beeper.navigation.display(bog.beeper.mode.status)
          
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
        // kill message scrolling with bog.beeper.ui.display.feeder.timer.b.clear()
        // handle delay in going back to the idle screen
        bog.beeper.ui.sleep.timer.renew()
        // handle night time indiglo
        if ( $('html').hasClass("night") || bog.beeper.fs.data.settings.daytime ) {
          bog.beeper.ui.indiglo.timer.renew()
          bog.beeper.ui.indiglo.on()
        }
        bog.beeper.button[e.currentTarget.classList.value]()
      })
      $(document).on('mousedown','#beeper',()=>{
        bog.beeper.events.drag = false
      })
      $(document).on('mousemove','#beeper',()=>{
        bog.beeper.events.drag = true
      })
      $(document).on('mouseup','#beeper',()=>{
        if (bog.beeper.events.drag) {
          bog.beeper.fs.data.settings.offsetleft = $('#beeper').offset().left
          bog.beeper.fs.data.settings.offsettop = $('#beeper').offset().top
          bog.beeper.fs.write()
        }
        bog.beeper.events.drag = false
      })
    }
  }
  
}

bog.beeper.init()