var sticker = {

  init: () => {
    // run events
    // build object
    if (!localStorage.getItem("stickermode")) {
      localStorage.setItem("stickermode","video")
    }
    sticker.data.mode = localStorage.getItem("stickermode")
    //$('#stickerbox .mode .'+sticker.data.mode).addClass("active")
    
    sticker.ui.build()
    $('#stickerbox .mode div.'+sticker.data.mode).addClass("active")
    sticker.events()
    
  },
  
  component: {
    picture: $('#stickerpicture'),
    video: $('#stickervideo'),
    localstream: null,
    picturecanvas: document.getElementById('stickerpicturecanvas'),
    videocanvas: document.getElementById('stickervideocanvas')
  },
  
  data: {
    mode: "video"
  },
  
  ui: {
    
    build: () => {
      
      $('body').append(
       `<div id="stickerbox" class="hidden ${sticker.data.mode}">
          <div class="close"></div>
          <div class="capture"></div>
          <div class="timeline"></div>
          <div class="countdown">self timer</div>
          <div class="mode">
            <div class="picture"></div>
            <div class="video"></div>
          </div>
          <div class="picture">
            
          </div>
          <div class="video">
            
          </div>
          <div class="caption"></div>
        </div>`
      )
      $('<div id="stickerbutton"></div>').insertAfter('#camerabutton')
      $('#stickervideo').appendTo('#stickerbox > .video')
      $('#stickerpicture').appendTo('#stickerbox > .picture')
    },
    // drawer: {
    //   
    //   open: () => {
    //   
    //   },
    //   close: () => {
    //   
    //   },    
    //   
    // },  
    camera: {
      
      open: () => {
        // e -> type
        sticker.ui.flash.set("loading..")
        $('#stickerbutton').addClass('howto')
        $('#stickerbox').removeClass("hidden")
        if (sticker.data.mode == "video") {
          $('#stickerbox').addClass("video")
          sticker.handler.power.on("video")
        }
        else if (sticker.data.mode == "picture") {
          $('#stickerbox').addClass("picture")
          sticker.handler.power.on("picture")
        }
      },
      
      close: () => {
        // e -> type
        $('#stickerbutton').removeClass('howto')
        $('#stickerbox').addClass("hidden")
        sticker.handler.power.off()
      },
      
      powerbutton: () => {
        $('#stickerbutton, #stickerbox').addClass("disabled")
        setTimeout(()=>{
          $('#stickerbutton, #stickerbox').removeClass("disabled")
        },1500)
        if ( $('#stickerbox').hasClass("hidden") ) {
          $('#stickerbutton').addClass("howto") 
          sticker.ui.camera.open()
        }
        else {
          $('#stickerbutton').removeClass("howto")
          sticker.ui.camera.close()
        }
      },
      
      type: (e) => {
        
        if (e == "video") {
          if (sticker.data.mode == "video") {
            return
          }
          $('#stickerbutton, #stickerbox').addClass("disabled")
          setTimeout(()=>{
            $('#stickerbutton, #stickerbox').removeClass("disabled")
          },1500)          
          $('#stickerbox .mode .picture').removeClass("active")
          $('#stickerbox .mode .video').addClass("active")
          sticker.ui.flash.set("loading..")
          sticker.handler.power.off()
          localStorage.setItem("stickermode","video")
          // stop picture start video
          sticker.data.mode = "video"
          $('#stickerbox').removeClass("picture")
          $('#stickerbox').addClass("video")
          setTimeout(()=>{
            sticker.handler.power.on("video")
          },1000)
        }
        else if (e == "picture") {
          if (sticker.data.mode == "picture") {
            return
          }
          $('#stickerbutton, #stickerbox').addClass("disabled")
          setTimeout(()=>{
            $('#stickerbutton, #stickerbox').removeClass("disabled")
          },1500)          
          $('#stickerbox .mode .video').removeClass("active")
          $('#stickerbox .mode .picture').addClass("active")          
          sticker.ui.flash.set("loading..")
          sticker.handler.power.off()
          localStorage.setItem("stickermode","picture")
          // stop video start picture
          sticker.data.mode = "picture"
          $('#stickerbox').removeClass("video")
          $('#stickerbox').addClass("picture")
          setTimeout(()=>{
            sticker.handler.power.on("picture")
          },1000)          
        }
      },
      
      countdown: () => {
        
        $('#stickerbox .caption').addClass("counting")
        $('#stickerbox .caption').html("3")
        setTimeout(()=>{$('#stickerbox .caption').html("2")},700)
        setTimeout(()=>{$('#stickerbox .caption').html("1")},1400)
        
           
        setTimeout(()=>{
          $('#stickerbox .capture').click()
          $('#stickerbox, #stickerbutton').removeClass("disabled") 
          $('#stickerbox .caption').html("")    
          $('#stickerbox .caption').removeClass("counting")
        },2100)        
      }
    },
    
    flash: {
      set: (e) => {
        $('#stickerbox .caption').html(e)
      },
      clear: () => {
        $('#stickerbox .caption').html("")
      }
    }
  },
  
  events: () => {
    
    $(document).on('click','#stickerbutton',()=>{
      sticker.ui.camera.powerbutton() 
    })
    $(document).on('click','#stickerbox .close',()=>{
      sticker.ui.camera.close() 
    })
    $(document).on('click','#stickerbox .countdown',()=>{
      $('#stickerbox, #stickerbutton').addClass("disabled")
      sticker.ui.camera.countdown() 
    })
    $(document).on('click','#stickerbox .capture',()=>{
      console.log("ok")
      sticker.handler.click()
      $('#stickerbox').addClass("disabled")
      setTimeout(()=>{
        $('#stickerbox').removeClass("disabled")
      },1500)
    })
    $(document).on('click','#stickerbox .mode div.picture',()=>{
      sticker.ui.camera.type("picture") 
    })
    $(document).on('click','#stickerbox .mode div.video',()=>{
      sticker.ui.camera.type("video") 
    })
  
  },
  
  handler: {
    
    click: () => {
      
      if (sticker.data.mode == "picture" ) {

        new Audio('https://bog.jollo.org/au/camera.mp3').play()
        sticker.handler.picturecamera()
      
      }
      else {
        

        
        sticker.handler.videocamera.init()
        
        
        //console.log(uri)
        // webcamtoimgur(uri)
        // proces video
        
      }
      $('#camerabutton').prop("disabled", true)
      setTimeout(function(){
        $('#camerabutton').prop("disabled", false);
      },3000);      
      
    },
  
    // picture: () => {
    //   
    // }, 
    
    power: {

      on: (e) => {
        console.log("on")
        sticker.handler.power.off()
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          console.log("one")
          navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            sticker.ui.flash.clear()
            $(sticker.component[e])[0].src = window.URL.createObjectURL(stream)
            sticker.component.localstream = stream
            $(sticker.component[e])[0].play()
          })
        }
        else if (navigator.getUserMedia) { 
        console.log("two")
          navigator.getUserMedia({ video: true }, function(stream) {
            sticker.ui.flash.clear()
            $(sticker.component[e])[0].src = window.URL.createObjectURL(stream)
            sticker.component.localstream = stream
            $(sticker.component[e])[0].play()
          }, errBack)
        } 
        else if (navigator.webkitGetUserMedia) { 
        console.log("three")
          navigator.webkitGetUserMedia({ video: true }, function(stream){
            sticker.ui.flash.clear()
            $(sticker.component[e])[0].src = window.URL.createObjectURL(stream)
            sticker.component.localstream = stream
            $(sticker.component[e])[0].play()
          }, errBack)
        } 
        else if (navigator.mozGetUserMedia) { 
        console.log("four")
          navigator.mozGetUserMedia({ video: true }, function(stream){
            sticker.ui.flash.clear()
            $(sticker.component[e])[0].src = window.URL.createObjectURL(stream)
            sticker.component.localstream = stream
            $(sticker.component[e])[0].play()
          }, errBack)
        }        
      },
      
      off: () => {
        if (sticker.component.localstream) {
          sticker.component.localstream.getVideoTracks()[0].stop()
          sticker.component.localstream = null
          $('video').removeAttr("src")
        }
      }
    
    },
    
    picturecamera: () => {

      $('#stickerbox').addClass("cameraflash")
      
      setTimeout(()=>{
        $('#stickerbox').removeClass("cameraflash")
      },600)
      
      var context = sticker.component.picturecanvas.getContext('2d')
      context.drawImage($(sticker.component.picture)[0], 0, 0, 400, 300)
      
      var image = $('#stickerpicturecanvas').getCanvasImage()
      var uri = image.substring(22)

      webcamtoimgur(uri)
    
    },
    
    videocamera: {
      
      videoframebuffer: null,
      current: null,
      target: 40,
      delay: 100,
      
      init: () => {
        $('#stickerbutton, #stickerbox').addClass("disabled")
        setTimeout(()=>{
          $('#stickerbutton, #stickerbox').removeClass("disabled")
        },10000)        
        $('#stickerbox .timeline').addClass("transition")
        setTimeout(()=>{
          $('#stickerbox .timeline').addClass("recording")
        },30)
        sticker.handler.videocamera.videoframebuffer = []
        sticker.handler.videocamera.current = 0
        sticker.handler.videocamera.record()

      },
      
      record: () => {
        
        //$('#stickerbox .caption').addClass("counting")
        //sticker.ui.flash.set(sticker.handler.videocamera.target - sticker.handler.videocamera.current)
        sticker.handler.videocamera.current++
        var context = sticker.component.videocanvas.getContext('2d')
        context.drawImage($(sticker.component.video)[0], 0, 0, 123, 92)
        
        var image = $('#stickervideocanvas').getCanvasImage("jpeg",0.2)
        var uri = image.substring(23)
        
        sticker.handler.videocamera.videoframebuffer.push(uri)
        if (sticker.handler.videocamera.current >= sticker.handler.videocamera.target) {
          sticker.handler.videocamera.endoftape()
        }
        else {
          setTimeout(()=>{
            sticker.handler.videocamera.record()
          },sticker.handler.videocamera.delay)
        }
        
      },
      
      endoftape: () => {
        $('#stickerbox .caption').removeClass("counting")
        sticker.ui.flash.clear()
        send({
          type: "stickervideo", 
          data: sticker.handler.videocamera.videoframebuffer
        })
        $('#stickerbox .timeline').removeClass("transition")
        setTimeout(()=>{
          $('#stickerbox .timeline').removeClass("recording")
        },30)
        
      },
      
      rewind: () => {
        
      }
      
      
    },
    
    request: {
      
    }
  
  }
  
}

sticker.init()