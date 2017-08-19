const bog = {}

// build desktop bogchat application

document.body.innerHTML = `
  <div id="logo"></div>
  <div class="line"></div>
  <div id="space"></div>
  <div id="container">
    <div id="content"></div>
    <div id="whatshot"></div>
    <div id="crawl"></div>
    <div id="zoo" class="empty">
      <div id="listen">
        <iframe width="30" height="15" src="https://www.youtube.com/embed/8myYyMg1fFE?&amp;rel=0&amp;loop=1&amp;showinfo=0&amp;disablekb=1&amp;modestbranding=1&amp;hd=1&amp;autohide=1&amp;color=white&amp;playlist=8myYyMg1fFE" frameborder="0" allowfullscreen=""></iframe>
      </div>
      <button id="leavezoo">leave zoo</button>
      <div id="exhibit"></div>
    </div>
  </div>
  <div id="searchbar"></div>
  <video id="stickervideo" width="123" height="92" autoplay></video>
  <video id="stickerpicture" width="400" height="300" autoplay></video>
  <canvas id="stickerpicturecanvas" width="400" height="300" style="display:none"></canvas>
  <canvas id="stickervideocanvas" width="123" height="92" style="display:none"></canvas>
  <div id="bin">
    <div id="newbinbutton"></div>
    <div id="backupbutton"></div>
    <div id="togglefavedbogchatitemsbutton"></div>
    <div id="togglefavedradioplaylistbutton"></div>
    <div id="deletebinbutton"></div>
    <div id="favbintogglebutton"></div>
    <div id="biggerbinbutton"></div>
    <div id="binarea"></div>
    <div id="favarea">
      <div id="favareacontainer"><img style="position:absolute;left:38px;bottom:0;" src="https://upload.wikimedia.org/wikipedia/commons/1/19/Under_construction_graphic.gif"></div>
      <div id="shufflefavarea" title="shuffle fav area"></div>
      <div id="togglerapidtosave" title="toggle rapid-fav-to-save"></div>
    </div>
  </div>
  <div id="msg">
    <div id="modem">
      <div class="led send">     </div>
      <div class="led receive">  </div>
      <div class="led power">    </div>
    </div>
    <span id="status">connecting...</span>
    <input type="text" spellcheck=false id="input" disabled="disabled" />
    <div id="storedbutton" ondragenter="dragpopup()"></div>
    <div id="trashlock"></div>
    <div id="storedarea">
      <div id="storedcontainer"></div>
      <input id="storedinput" type="text">
    </div>
    <div id="popbutton"></div>
    <div id="sendbutton"></div>
    <div id="uploadbutton"></div>
    <div id="stickerbutton"></div>
    <div id="lockbutton"></div>
    <div id="binbutton"></div>
    <div id="mutebutton"></div>
    <div id="favcurrenttrackbutton"></div>
    <div id="radiobutton"></div>
    <div id="radioeject" class="ejected closed">
      <div id="radioejectdisplay">
        <div id="radioejectdisplaycontent">
        </div>
      </div>
    </div>
    <div id="radiohud">
      <div id="radioled">888:88</div>
      <div id="radioledactive"></div>
      <div id="radiotext">XXXXXXXXXXXXXXXXXXXXXXXX</div>
      <div id="radiosubtext"></div>
      <div id="radioejection">&#9167;</div>
      <div id="radiosource">&#9911;</div>
      <div id="radiocontrols">
        <span data-id="1" class="radiocontrol">_</span> 
        <span data-id="2" class="radiocontrol">_</span> 
        <span data-id="3" class="radiocontrol">_</span> 
        <span data-id="4" class="radiocontrol">_</span> 
        <span data-id="5" class="radiocontrol">_</span> 
      </div>
      <div id="radioqueueloading">Q</div>
      <div id="radiominremain">x?</div>
    </div>
  </div>
  <input id="fileinput" accept="image/*" type="file" onchange="pushfile()">
`


// out of order or depreciated: "draw", "drums", "fidget", "hamster"
// neue todo: "draw", "drums", "superbar"
var bogmodsdesktop = [
  "pepper",
  "chapel",
  "beeper",
  "search",
  "crawl",
  "zoo",
  "bin",
  "modem",
  "sticker",
  "chat",
  "radio",
  "connect",
  "actions",
  "images",
  "breakapart",
  "bubbles",
  "pak",
  "mobile"
]

for (var f=0;f<bogmodsdesktop.length;f++) {
  document.write('<script src="/js/'+bogmodsdesktop[f]+'.js?'+bogversion+'"><\/script>')
} 