let bogstyles = [
  "virtual", "sticker", "chapel", "beeper", "search", "mobile", "crawl", "zoo","modem", "bogchat", "bin", "bubbles","radio","draw"
]
for (var f=0;f<bogstyles.length;f++) {
  document.write('<link rel="stylesheet" href="/css/'+bogstyles[f]+'.css?'+bogversion+'" type="text/css">')
}

