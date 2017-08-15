const chapel = {
  timer: {
    a: null,
    b: null,
    closing: false,
  },
  service: {
    en: () => {
      // already in progress
      // halt all other sounds on the site
      
      $('html').addClass("chapel")
      $('html').removeClass("chapelfadein chapelfadeingoal")
      setTimeout(()=>{
        
        $('#content p').remove()
        $('#exhibit').html("")
        $('#zoo').addClass("empty")   
        window.stop()    
        // if (history && history.pushState){
        //   history.pushState(null, null, '/chapel_service_415p-430p');
        // }        
      },50)
       
    },
    open: () => {
      
      // fade in, then en()
      $('html').addClass("chapelfadein")
      if (!chapel.timer.closing) {
        chapel.timer.a = setTimeout(()=>{ $('html').addClass("chapelfadeingoal") },50)
        chapel.timer.b = setTimeout(()=>{
          chapel.service.en()
        },6000)
      }
    },
    
    closed: () => {
      // fade out/exit
      $('#content p').remove()
      $('#exhibit').html("")      
      $('html').addClass("chapelx")
      // if (history && history.pushState){
      //   history.pushState(null, null, '/');
      // }      
      chapel.timer.closing = true
      clearTimeout(chapel.timer.a)
      clearTimeout(chapel.timer.b)
      setTimeout(()=>{
        $('html').removeClass("chapel chapelx chapelfadein chapelfadeingoal")
        chapel.timer.closing = false
      },7000)      
    }
  },
  sound: {
    data: null,
    ctime: 0,
    start: (ctime) => {
      chapel.sound.ctime = ctime
      // initiate sound at time subtracted from ctime
      chapel.sound.data = new Audio("https://bog.jollo.org/au/katholique.mp3")
      setTimeout(()=>{
        chapel.sound.data.currentTime = chapel.sound.ctime / 1000
        setTimeout(()=>{
          chapel.sound.data.play()
        },200)
      },1000)
    },
    stop: () => {
    }
  }
}