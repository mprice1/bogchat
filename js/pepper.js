const pepper = {

  init: () => {
    pepper.data.musicbox.audio = new Audio('https://bog.jollo.org/au/pepper/musicbox.mp3')
    pepper.data.winder.audio = new Audio('https://bog.jollo.org/au/pepper/wind.mp3')
    pepper.events()
  },
  data: {
    musicbox: {
      audio: null,
      target: 0,
      end: 62,
      playing: false,
    },
    winder: {
      audio: null
    }
  },
  timer: () => {
    if (pepper.data.musicbox.playing) {
      setTimeout(()=>{
        if (pepper.data.musicbox.audio.currentTime >= pepper.data.musicbox.end) {       
          pepper.handler.pause()
          pepper.handler.reset()
        }
        else if (pepper.data.musicbox.audio.currentTime >= pepper.data.musicbox.target) {
          pepper.handler.pause()
        }
        else {      
          requestAnimationFrame(pepper.timer)
        }
      },100)
    }
    else {
      console.log("not playing")
    }
  },
  events: () => {
    $(document).on('click','img.pepper',()=>{
      pepper.handler.wind()
    })
  },
  handler: {
    wind: () => {
      pepper.data.musicbox.target+=2
      pepper.data.winder.audio.play()
      setTimeout(()=>{
        pepper.handler.play()
      },200)
    },
    play: () => {
      
      if (!pepper.data.playing) {
        pepper.data.musicbox.audio.play()
        pepper.data.musicbox.playing = true
        pepper.timer()
      }
      
    },
    pause: () => {
      pepper.data.musicbox.audio.pause()
      pepper.data.musicbox.playing = false      
    },
    reset: () => {
      pepper.data.musicbox.audio.currentTime = 0
    }
  }
}

pepper.init()