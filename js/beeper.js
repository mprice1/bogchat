var beeper = {

  init: () => {
    // build beeper
    beeper.ui.create()
    // init localstorage settings
    beeper.events()
    beeper.fs.init()
    // send request to fetch history
    // create events
  },
  
  ui: {
    create: () => {
      $('body').append('<div id="beeper"></div>')
      $('#beeper').append(
       `<div class="indigloscreen"></div>
        <div class="ledscreen">
          <div id="beeperleda">QLOPPI Mi-Yu</div>
          <div id="beeperledb">Beeper Service</div>
        </div>
        <button class="left"></button>
        <button class="right"></button>
        <button class="up"></button>
        <button class="down"></button>
        <button class="menu"></button>
        <button class="indiglo"></button>`
      )
    },
    scale: {
      up: () => {
        
      },
      down: () => {
        
      }
    },
    display: {
      data: {
        a: () => {
          
        },
        b: () => {
          
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
      timer: {
        data: null,
        clear: () => {
          clearTimeout(beeper.ui.indiglo.timer.data)
        },
        renew: () => {
          beeper.ui.indiglo.timer.clear();
          beeper.ui.indiglo.timer.data = setTimeout(() => {
            if (!beeper.fs.data.settings.indiglonighton) {
              beeper.ui.indiglo.off() 
            }
          }, 20000)          
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
    }
    // handle controls
  },
  
  button: {
    
    up: () => {
      
    },
    down: () => {
      
    },
    left: () => {
      
    },
    right: () => {
      
    },
    menu: () => {
      
    },
    indiglo: () => {
      
      if ($('#beeper .indigloscreen').hasClass("on")) {
        $('#beeper .indigloscreen').removeClass("on")
        beeper.ui.indiglo.timer.clear()
      }
      else {
        $('#beeper .indigloscreen').addClass("on")
        beeper.ui.indiglo.timer.renew() 
      }
      
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
            indiglonighton: false,
            scale: 1
          },
          data: {}
        }))
      }
      beeper.fs.read()
      
    }
    
  },
  
  handler: {
    init: () => {
      
    }
    // handle messages

    // indiglo QLOPPI Mi-Yu always-on(tm) technology


    
    
  },
  
  events: () => {
    $(document).on('click','#beeper button',(e)=>{
      // handle night time indiglo
      if ( $('html').hasClass("night") 
        && ( e.currentTarget.classList.value != "indiglo") ) {
        beeper.ui.indiglo.timer.renew()
        beeper.ui.indiglo.on()
      }
      beeper.button[e.currentTarget.classList.value]()
    })
  }
  
}

beeper.init()