var beeper = {
  
  mode: null,
  
  init: () => {
    // build beeper
    
    beeper.ui.create()
    // init localstorage settings
    beeper.events.listeners()
    beeper.fs.init()
    // init
    beeper.mode = "init"
    // setTimeout(()=>{
    //   beeper.ui.display.data.a("Qloppi Mi-Yu")
    //   beeper.ui.display.data.b("Beeper Service")
    //   beeper.ui.indiglo.on()
    // },300)
    // setTimeout(()=>{
    //   beeper.ui.display.data.a("Your World")
    //   beeper.ui.display.data.b("Connected.")
    // },3000)
    // setTimeout(()=>{
    //   beeper.ui.indiglo.off()
    // },6000)
    // setTimeout(()=>{
    //   $('#beeper').removeClass("disabled")
    //   beeper.handler.idle.init()
    // },6800)
    
    // fast on:
    beeper.ui.transform()
    beeper.handler.idle.init()
    $('#beeper').removeClass("disabled")
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
          // scroll system 
          // e => message
          // target => a/b
          
          // if length of e is less than 16 no need to scroll
          if (e.length <= 16) {
            console.log("no need to scroll")
            return
            
          }
          else {
            console.log("scroll")
            return
          }
          
          beeper.ui.display.feeder.data.message[target] = e
          beeper.ui.display.feeder.data.position[target] = 0
          
        },
        
        scroll: (target) => {
          
          // find target length
          var duration = beeper.ui.display.feeder.data.message[target].length - 1
          
          
        },
        
        timer: {
          
          a: null,
          b: null,
          
        },
        
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
    }
    
    // handle controls
  },
  
  button: {
    
    up: () => {
      
      (({
        settings: () => {
          beeper.handler.settings.control.pitch("up")
        }
      })[beeper.mode] || (() => {  } ))()      
      
    },
    down: () => {
      
      (({
        settings: () => {
          beeper.handler.settings.control.pitch("down")
        }
      })[beeper.mode] || (() => {  } ))()        
      
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
        }
      })[beeper.mode] || (() => {  } ))()
      
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
        }
      })[beeper.mode] || (() => {  } ))()
      
    },
    menu: () => {
      
      // depending on where you are
      // open menu, select
      
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
      })[beeper.mode] || (() => {  } ))()
      
    },
    home: () => {
      
      beeper.handler.idle.init()
      
    },
    
  },
  
  fs: {
    data: {},   
    read: () => {
      beeper.fs.data = JSON.parse(localStorage.getItem("bogbeeper"))
    },
    write: () => {
      localStorage.setItem("bogbeeper", JSON.stringify(beeper.fs.data))
    },
    init: () => {
      if (!localStorage.getItem('bogbeeper')) {
        console.log("here")
        localStorage.setItem("bogbeeper", JSON.stringify({
          settings: {
            chime:    0,
            timeout:  30,
            marquee:  10,
            indiglo:  false,
            autoopen: false,
            taehyung: false,
            daytime:  false,
            offsetleft: null,
            offsettop: null,
          },
          messages: []
        }))
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
        beeper.mode = "idle"
        beeper.ui.display.data.a("☺")
        beeper.ui.display.data.b("0/0")        
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
        
        beeper.mode = "menu"
        beeper.handler.menu.data.active = 2
        beeper.navigation.display(beeper.mode)
        
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
          })[beeper.handler[beeper.mode].data.options[beeper.handler[beeper.mode].data.active].label])()
          
        },
        
        left: () => {
          
          beeper.handler.menu.data.active--
          beeper.navigation.control(beeper.mode)
          
        },
        
        right: () => {
          
          beeper.handler.menu.data.active++
          beeper.navigation.control(beeper.mode)
          
        }
      
      }
      
    },
    
    messages: {
      
      data: {
        
        request: () => {
          // get old messages from the server, forward to history(e)
        },
      
        history: (x) => {
          // response array of old messages
          for (e in x) {
            beeper.handler.messages.data.write(e, false)
          }
        },
        
        incoming: (e) => {
          
          beeper.handler.messages.data.write(e, true)
          beeper.ui.indiglo.flicker()
          beeper.ui.display.data.a("new")
          beeper.ui.display.data.b("message!")
          beeper.handler.chime.tone.play()
          // real-time individual new message + chirp
        },
        
        upsert: (e, live) => {
          // store a message to filesystem, whether live(true) or history(false)
        },
        
        unread: {
          
          count: 0,
          calculate: () => {
            
          }
          
        }        
       
      },
      
      init: () => {
        
        beeper.mode = "messages"
        
      },
      
      
      control: {
        
        up: () => {
          
        },
        
        down: () => {
          
        }
        
      },
      
      
    },
    
    chime: {
      
      tone: {
        
        data: null,
        play: () => {
          if (beeper.handler.chime.tone.data) {
            beeper.handler.chime.tone.data.pause()
          }
          if ( beeper.handler.chime.data.options[beeper.handler.chime.data.active].label != "silent" ) {
            beeper.handler.chime.tone.data = new Audio(`https://bog.jollo.org/au/beeper/${beeper.handler.chime.data.active}.wav`)
            beeper.handler.chime.tone.data.play()
          }
        }
      },

      data: {
        
        active: null,
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
        
        beeper.mode = "chime"
        beeper.handler.chime.data.active = beeper.fs.data.settings.chime
        beeper.navigation.display(beeper.mode)
        
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
          beeper.navigation.control(beeper.mode)
          beeper.handler.chime.tone.play()
        },
        
        right: () => {
          beeper.handler.chime.data.active++
          beeper.navigation.control(beeper.mode)
          beeper.handler.chime.tone.play()
        }
      
      }      

    },
    
    settings: {
      
      data: {
        
        active: null,
        options: [
          {
            label: "indiglo stay on",
            glyph: null,
          },
          {
            label: "idle timeout",
            glyph: null,
          },
          {
            label: "marquee speed",
            glyph: null,
          },
          {
            label: "open on receive",
            glyph: null,
          },
          {
            label: "taehyung mode",
            glyph: null,
          },
          {
            label: "daytime indiglo",
            glyph: null,
          }
          
        ]
      },      
      
      init: () => {
        beeper.mode = "settings"
        beeper.handler.settings.data.active = 5
        beeper.handler.settings.data.options[0].glyph = beeper.fs.data.settings.indiglo
        beeper.handler.settings.data.options[1].glyph = beeper.fs.data.settings.timeout
        beeper.handler.settings.data.options[2].glyph = beeper.fs.data.settings.marquee
        beeper.handler.settings.data.options[3].glyph = beeper.fs.data.settings.autoopen
        beeper.handler.settings.data.options[4].glyph = beeper.fs.data.settings.taehyung
        beeper.handler.settings.data.options[5].glyph = beeper.fs.data.settings.daytime
        beeper.navigation.display(beeper.mode)
      },
      
      control: {
      
        select: () => {
          
          // indiglo
          beeper.fs.data.settings.indiglo = beeper.handler.settings.data.options[0].glyph
          beeper.fs.data.settings.timeout = beeper.handler.settings.data.options[1].glyph
          beeper.fs.data.settings.marquee = beeper.handler.settings.data.options[2].glyph
          beeper.fs.data.settings.autoopen = beeper.handler.settings.data.options[3].glyph
          beeper.fs.data.settings.taehyung = beeper.handler.settings.data.options[4].glyph
          beeper.fs.data.settings.daytime = beeper.handler.settings.data.options[5].glyph
          
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
          beeper.navigation.control(beeper.mode)
        },
        
        right: () => {
          beeper.handler.settings.data.active++
          beeper.navigation.control(beeper.mode)
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
              else if (beeper.handler.settings.data.options[2].glyph >= 20) {
                beeper.handler.settings.data.options[2].glyph = 20
              }
            },
            "open on receive": () => {
              beeper.handler.settings.data.options[3].glyph = !beeper.handler.settings.data.options[3].glyph
            },
            "taehyung mode": () => {
              beeper.handler.settings.data.options[4].glyph = !beeper.handler.settings.data.options[4].glyph
            },
            "daytime indiglo": () => {
              beeper.handler.settings.data.options[5].glyph = !beeper.handler.settings.data.options[5].glyph
            },
            
          })[beeper.handler[beeper.mode].data.options[beeper.handler[beeper.mode].data.active].label] || (() => {  } ))()
          beeper.navigation.display(beeper.mode)
          
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