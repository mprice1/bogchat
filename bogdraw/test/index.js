$(document).ready(function() {
  new ChickenPaint({
    uiElem: document.getElementById("chickenpaint-parent"),
    saveUrl: "",
    postUrl: "",
    exitUrl: "",
    allowSave: false,
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
})


