var videoopen = false
var video = document.getElementById('video');
var localstream

function cameraopen() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    video.src = window.URL.createObjectURL(stream)
    localstream = stream
    video.play()
  })
}

  else if (navigator.getUserMedia) { 
    navigator.getUserMedia({ video: true }, function(stream) {
      video.src = stream
      localstream = stream
      video.play()
    }, errBack)
  } 
  else if (navigator.webkitGetUserMedia) { 
    navigator.webkitGetUserMedia({ video: true }, function(stream){
      video.src = window.webkitURL.createObjectURL(stream);
      localstream = stream
      video.play()
    }, errBack)
  } 
  else if(navigator.mozGetUserMedia) { 
    navigator.mozGetUserMedia({ video: true }, function(stream){
      video.src = window.URL.createObjectURL(stream)
      localstream = stream
      video.play()
    }, errBack)
  }
}

var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')
var video = document.getElementById('video')

$('#camerabutton').click(function() {
  if (!videoopen) {
    $('#camerabutton').addClass('howto')
    $('#videobox').removeClass('hidden')
    videoopen = true
    cameraopen()
    $('#camerabutton').prop("disabled", true)
    setTimeout(function(){
    $('#camerabutton').prop("disabled", false);
    },1200);
  }
  else {
    //context.translate(400, 0)
    //context.scale(-1, 1)  
    context.drawImage(video, 0, 0, 400, 300)
    var image = $('#canvas').getCanvasImage()
    var uri = image.substring(22)
    webcamtoimgur(uri)
    $('#camerabutton').prop("disabled", true)
    setTimeout(function(){
    $('#camerabutton').prop("disabled", false);
    },3000);
  }
})

$('#videoclose').click(function() {
  videoopen = false
  $('#videobox').addClass('hidden')
  $('#camerabutton').removeClass('howto')
  localstream.getVideoTracks()[0].stop()
})

$('#countdowntimer').click(function() {
  $('#videobox span').html("3")
  setTimeout(()=>{$('#videobox span').html("2")},1000)
  setTimeout(()=>{$('#videobox span').html("1")},2000)
  $('#countdowntimer').attr("disabled","disabled")
  $('#videoclose').attr("disabled","disabled")
  $('#camerabutton').attr("disabled","disabled")
     
  setTimeout(()=>{
    $('#camerabutton').click()
    $('#countdowntimer').removeAttr("disabled")
    $('#videoclose').removeAttr("disabled")
    $('#camerabutton').removeAttr("disabled")  
    $('#videobox span').html("")    
  },3000)
})