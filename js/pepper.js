bog.pepper = {

  init: () => {
    bog.pepper.data.musicbox.audio = new Audio('https://bog.jollo.org/au/pepper/musicbox.mp3')
    bog.pepper.data.winder.audio = new Audio('https://bog.jollo.org/au/pepper/wind.mp3')
    bog.pepper.events()
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
    if (bog.pepper.data.musicbox.playing) {
      setTimeout(()=>{
        if (bog.pepper.data.musicbox.audio.currentTime >= bog.pepper.data.musicbox.end) {       
          bog.pepper.handler.pause()
          bog.pepper.handler.reset()
        }
        else if (bog.pepper.data.musicbox.audio.currentTime >= bog.pepper.data.musicbox.target) {
          bog.pepper.handler.pause()
        }
        else {      
          requestAnimationFrame(bog.pepper.timer)
        }
      },100)
    }
    else {
      console.log("not playing")
    }
  },
  events: () => {
    $(document).on('click','img.pepper',()=>{
      bog.pepper.handler.wind()
    })
  },
  handler: {
    wind: () => {
      bog.pepper.data.musicbox.target+=2
      bog.pepper.data.winder.audio.play()
      setTimeout(()=>{
        bog.pepper.handler.play()
      },200)
    },
    play: () => {
      
      if (!bog.pepper.data.playing) {
        bog.pepper.data.musicbox.audio.play()
        bog.pepper.data.musicbox.playing = true
        bog.pepper.timer()
      }
      
    },
    pause: () => {
      bog.pepper.data.musicbox.audio.pause()
      bog.pepper.data.musicbox.playing = false      
    },
    reset: () => {
      bog.pepper.data.musicbox.audio.currentTime = 0
    }
  }
}

bog.pepper.init()