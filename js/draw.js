bog.draw = {
  
  loaded: false,
  init: () => {
    if (!bog.draw.loaded) {
      $('#input').val("loading draw..")
      $('#input').attr("disabled","disabled")
      bog.draw.loaded = true
      // build the bog module
      var bogdraw = document.getElementById("bogdraw")
      bogdraw.innerHTML = `
        <div class="bogdrawtoolbox">
          <div class="bogdrawtools">
            <div class="bogdrawicon bogdrawseltool marquee"></div>
            <div class="bogdrawicon bogdrawseltool move"></div>
            <div class="bogdrawicon bogdrawseltool pen selected"></div>
            <div class="bogdrawicon bogdrawseltool pencil"></div>
            <div class="bogdrawicon bogdrawseltool airbrush"></div>
            <div class="bogdrawicon bogdrawseltool watercolor"></div>
            <div class="bogdrawicon bogdrawseltool fillbucket"></div>
            <div class="bogdrawicon bogdrawseltool drop"></div>
            <div class="bogdrawicon bogdrawseltool harderaser"></div>
            <div class="bogdrawicon bogdrawseltool softeraser"></div>
            <div class="bogdrawicon bogdrawseltool blender"></div>
            <div class="bogdrawicon bogdrawseltool smudge"></div>
            <div class="bogdrawicon bogdrawseltool dodge"></div>
            <div class="bogdrawicon bogdrawseltool burn"></div>
            <div class="bogdrawicon invert"></div>
            <div class="bogdrawicon blur"></div>
            <div class="bogdrawicon colornoise"></div>
            <div class="bogdrawicon mononoise"></div>
            <div class="bogdrawicon undo"></div>
            <div class="bogdrawicon redo"></div>
            <div class="bogdrawicon straightline"></div>
            <div class="bogdrawicon freehand selected"></div>  
          </div>
        </div>
        <div class="bogdrawlayerbox">
          <div class="bogdrawlayernew"></div>
          <div class="bogdrawlayerdel"></div>
          <div class="bogdrawlayerdupe"></div>
          <div class="bogdrawlayermergedown"></div>
          <div class="bogdrawlayermergeall"></div>
          <div class="bogdrawnewcanvas"></div>
          <div class="bogdrawpublishcanvas"></div>
        </div>
        <div class="spicychicken">
          <div id="chickenpaint-parent"></div>
        </div>`
        
      $("head").append(`<link rel="stylesheet" href="https://bog.jollo.org/draw/css/chickenpaint.css" type="text/css" />`)  
      
      var head = document.getElementsByTagName("head")[0]
      
      var raf = document.createElement('script')
      raf.src='https://bog.jollo.org/draw/lib/raf.js'

      var espromise = document.createElement('script')
      espromise.src='https://bog.jollo.org/draw/lib/es6-promise.min.js'

      var mpep = document.createElement('script')
      mpep.src='https://bog.jollo.org/draw/lib/pep.min.js'

      var mpako = document.createElement('script')
      mpako.src='https://bog.jollo.org/draw/lib/pako-1.0.1-1.js'

      var keymaster = document.createElement('script')
      keymaster.src='https://bog.jollo.org/draw/lib/keymaster.js'

      var meventemit = document.createElement('script')
      meventemit.src='https://bog.jollo.org/draw/lib/EventEmitter.min.js'

      var mfilesaver = document.createElement('script')
      mfilesaver.src='https://bog.jollo.org/draw/lib/FileSaver.min.js'

      var mbootstrap = document.createElement('script')
      mbootstrap.src='https://bog.jollo.org/draw/lib/bootstrap.min.js'

      var chickenpt = document.createElement('script')
      chickenpt.src = 'https://bog.jollo.org/draw/js/chickenpaint.js'

      head.appendChild(raf)
      head.appendChild(espromise)
      head.appendChild(mpep)
      head.appendChild(mpako)
      head.appendChild(keymaster)
      head.appendChild(meventemit)
      head.appendChild(mfilesaver)
      head.appendChild(mbootstrap)
      head.appendChild(chickenpt)
      
      // delay this until the last script is loaded
    }
    else {
      $('html').toggleClass("draw")
    }
    
  },
  build: () => {
    new ChickenPaint({
      uiElem: document.getElementById("chickenpaint-parent"),
      saveUrl: "",
      postUrl: "",
      exitUrl: "",
      allowSave: true,
      allowMultipleSends: false,
      resourcesRoot: "https://bog.jollo.org/draw/"
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.freehand', ()=>{
      $('div.bogdrawtools div.bogdrawicon.straightline').removeClass("selected")
      $('div.bogdrawtools div.bogdrawicon.freehand').addClass("selected")
      $('#chickenpaint-parent li.chickenpaint-toolbar-button.chickenpaint-tool-freehand').click()
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.straightline', ()=>{
      $('div.bogdrawtools div.bogdrawicon.freehand').removeClass("selected")    
      $('div.bogdrawtools div.bogdrawicon.straightline').addClass("selected")
      $('#chickenpaint-parent li.chickenpaint-toolbar-button.chickenpaint-tool-line').click()
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.undo', ()=>{
      $('#chickenpaint-parent li.chickenpaint-toolbar-button.chickenpaint-tool-undo').click()
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.redo', ()=>{
      $('#chickenpaint-parent li.chickenpaint-toolbar-button.chickenpaint-tool-redo').click()
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.colornoise', ()=>{
      console.log("ok")
      $('#chickenpaint-parent > nav > div > ul > li.dropdown > ul > li:nth-child(10) > a')[1].click()
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.mononoise', ()=>{
      $('#chickenpaint-parent > nav > div > ul > li.dropdown > ul > li:nth-child(9) > a')[0].click()
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.invert', ()=>{
      $('#chickenpaint-parent > nav > div > ul > li.dropdown > ul > li:nth-child(5) > a').click()
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.blur', ()=>{
      $('#chickenpaint-parent > nav > div > ul > li.dropdown > ul > li:nth-child(7) > a').click()
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.marquee', ()=>{
      $('.bogdrawseltool').removeClass("selected")
      $('div.bogdrawtools div.bogdrawicon.marquee').addClass("selected")
      $('#chickenpaint-parent li.chickenpaint-toolbar-button.chickenpaint-tool-rect-selection').click()
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.move', ()=>{
      $('.bogdrawseltool').removeClass("selected")
      $('div.bogdrawtools div.bogdrawicon.move').addClass("selected")
      $('#chickenpaint-parent li.chickenpaint-toolbar-button.chickenpaint-tool-move').click()
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.pen', ()=>{
      $('.bogdrawseltool').removeClass("selected")
      $('div.bogdrawtools div.bogdrawicon.pen').addClass("selected")
      $('#chickenpaint-parent li.chickenpaint-toolbar-button.chickenpaint-tool-pen').click()
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.pencil', ()=>{
      $('.bogdrawseltool').removeClass("selected")
      $('div.bogdrawtools div.bogdrawicon.pencil').addClass("selected")
      $('#chickenpaint-parent li.chickenpaint-toolbar-button.chickenpaint-tool-pencil').click()
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.airbrush', ()=>{
      $('.bogdrawseltool').removeClass("selected")
      $('div.bogdrawtools div.bogdrawicon.airbrush').addClass("selected")
      $('#chickenpaint-parent li.chickenpaint-toolbar-button.chickenpaint-tool-airbrush').click()
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.watercolor', ()=>{
      $('.bogdrawseltool').removeClass("selected")
      $('div.bogdrawtools div.bogdrawicon.watercolor').addClass("selected")
      $('#chickenpaint-parent li.chickenpaint-toolbar-button.chickenpaint-tool-water').click()
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.fillbucket', ()=>{
      $('.bogdrawseltool').removeClass("selected")
      $('div.bogdrawtools div.bogdrawicon.fillbucket').addClass("selected")
      $('#chickenpaint-parent li.chickenpaint-toolbar-button.chickenpaint-tool-flood-fill').click()
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.drop', ()=>{
      $('.bogdrawseltool').removeClass("selected")
      $('div.bogdrawtools div.bogdrawicon.drop').addClass("selected")
      $('#chickenpaint-parent li.chickenpaint-toolbar-button.chickenpaint-tool-color-picker').click()
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.harderaser', ()=>{
      $('.bogdrawseltool').removeClass("selected")
      $('div.bogdrawtools div.bogdrawicon.harderaser').addClass("selected")
      $('#chickenpaint-parent li.chickenpaint-toolbar-button.chickenpaint-tool-eraser').click()
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.softeraser', ()=>{
      $('.bogdrawseltool').removeClass("selected")
      $('div.bogdrawtools div.bogdrawicon.softeraser').addClass("selected")
      $('#chickenpaint-parent li.chickenpaint-toolbar-button.chickenpaint-tool-soft-eraser').click()
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.blender', ()=>{
      $('.bogdrawseltool').removeClass("selected")
      $('div.bogdrawtools div.bogdrawicon.blender').addClass("selected")
      $('#chickenpaint-parent li.chickenpaint-toolbar-button.chickenpaint-tool-blender').click()
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.smudge', ()=>{
      $('.bogdrawseltool').removeClass("selected")
      $('div.bogdrawtools div.bogdrawicon.smudge').addClass("selected")
      $('#chickenpaint-parent li.chickenpaint-toolbar-button.chickenpaint-tool-smudge').click()
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.dodge', ()=>{
      $('.bogdrawseltool').removeClass("selected")
      $('div.bogdrawtools div.bogdrawicon.dodge').addClass("selected")
      $('#chickenpaint-parent li.chickenpaint-toolbar-button.chickenpaint-tool-dodge').click()
    })
    $(document).on('click', 'div.bogdrawtools div.bogdrawicon.burn', ()=>{
      $('.bogdrawseltool').removeClass("selected")
      $('div.bogdrawtools div.bogdrawicon.burn').addClass("selected")
      $('#chickenpaint-parent li.chickenpaint-toolbar-button.chickenpaint-tool-burn').click()
    })
    $(document).on('click','.bogdrawlayernew',()=>{
      $('#chickenpaint-parent li.chickenpaint-small-toolbar-button.chickenpaint-add-layer').click()
    })
    $(document).on('click','.bogdrawlayerdel',()=>{
      $('#chickenpaint-parent li.chickenpaint-small-toolbar-button.chickenpaint-remove-layer').click()
    })
    $(document).on('click','.bogdrawlayerdupe',()=>{
      $('#chickenpaint-parent > nav > div > ul > li.dropdown > ul > li:nth-child(1) > a')[2].click()
    })
    $(document).on('click','.bogdrawlayermergedown',()=>{
      $('#chickenpaint-parent > nav > div > ul > li.dropdown > ul > li:nth-child(3) > a')[1].click()
    })
    $(document).on('click','.bogdrawlayermergeall',()=>{
      $('#chickenpaint-parent > nav > div > ul > li.dropdown > ul > li:nth-child(4) > a')[0].click()
    })
    $(document).on('click','.bogdrawnewcanvas', ()=>{
      bog.draw.clear()
    })   
    $(document).on('click','.bogdrawpublishcanvas', ()=>{
      bog.draw.publish()
    })   
    $('#input').val("")
    $('#input').removeAttr("disabled")    
    $('html').addClass("draw")
    // weird javascript straggler wtf
    $('#chickenpaint-parent > div > div.chickenpaint-palettes > div.chickenpaint-palette.chickenpaint-palette-brush > div.chickenpaint-palette-body > div:nth-child(1) > select > option:nth-child(6)').remove()
    
  },
  clear: () => {
    // mergeall
    $('#chickenpaint-parent > nav > div > ul > li.dropdown > ul > li:nth-child(4) > a')[0].click()
    // clear
    $('#chickenpaint-parent > nav > div > ul > li > ul > li:nth-child(1) > a')[3].click()    
  },
  publish: () => {
    $('.bogdrawpublish').addClass("disabled")
    setTimeout(()=>{
      $('.bogdrawpublish').removeClass("disabled")
    },10000)
    $('#chickenpaint-parent > nav > div > ul > li > ul > li > a')[0].click()
  }

}
