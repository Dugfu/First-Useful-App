const SitemapGenerator = require('sitemap-generator');
const { dialog } = require('electron').remote
const http = require('http')
const geolocation = require('geolocation')

// geolocation.getCurrentPosition(function (err, position) {
//    if (err) throw err;
//    console.log(position)
// })



let info={
   timeOpened:new Date(),
   timezone:(new Date()).getTimezoneOffset()/60,

   pageon: window.location.pathname,
   referrer: document.referrer,
   previousSites: history.length,

   browserName: navigator.appName,
   browserEngine: navigator.product,
   browserVersion1a: navigator.appVersion,
   browserVersion1b: navigator.userAgent,
   browserLanguage: navigator.language,
   browserOnline: navigator.onLine,
   browserPlatform: navigator.platform,
   javaEnabled: navigator.javaEnabled(),
   dataCookiesEnabled: navigator.cookieEnabled,
   dataCookies1: document.cookie,
   dataCookies2: decodeURIComponent(document.cookie.split(";")),
   dataStorage: localStorage,

   sizeScreenW: screen.width,
   sizeScreenH: screen.height,
   sizeDocW: document.width,
   sizeDocH: document.height,
   sizeInW: innerWidth,
   sizeInH: innerHeight,
   sizeAvailW: screen.availWidth,
   sizeAvailH: screen.availHeight,
   scrColorDepth: screen.colorDepth,
   scrPixelDepth: screen.pixelDepth,

};



let count = 0;
let arr_complete = [];

function launchSitemap(){
   count = 0;
   arr_complete = [];
   let xhr = new XMLHttpRequest();
   xhr.open("GET","https://api.ipify.org", true);
   xhr.send();
   xhr.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
         info.ip = this.responseText;
      }
   }
   console.log("Info Client :");
   console.log(info);
   let url = document.getElementById('url').value;
   let depth = document.getElementById('depth').value || 0;
   let folder = document.getElementById("folder").getAttribute("value");
   if(folder != null){
      folder+="\\sitemap.xml";
   }else{
      folder="./sitemap.xml";
   }
   let pMap = [];
   if(depth == 0 || depth >= 10){
      pMap = [1.0,0.9,0.8,0.7,0.6,0.5,0.4,0.3,0.2,0.1,0]
   }else{
      let inc = 1/depth;
      for(let i=1;i>=0;i-=inc){
         pMap.push(roundToTwo(i));
      }
   }
   let demo = document.getElementById("demo");
   // demo.innerHTML = pMap.join(",");
   // console.log(pMap);
   let patt = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
   if(patt.exec(url) != null){
      // console.log(url);
      const generator = SitemapGenerator(url, {
         maxDepth: depth,
         filepath: folder,
         maxEntriesPerFile: 50000,
         stripQuerystring: true,
         priorityMap: pMap
      });
      generator.on('done', () => {
         alert('done');
         console.log(arr_complete)
      });
      generator.on('add', (data) => {
         // document.getElementById("demo").innerHTML += data.url + " [Info: Code=" + data.stateData.code +", Message= " + http.STATUS_CODES[data.stateData.code] + "]<br>";
         // console.log(data);
         count++;
         document.getElementById("demo").innerHTML = count;
         arr_complete.push(data);
      });
      generator.on('error', (error) => {
         // document.getElementById("demo").innerHTML += error.url + " : " + http.STATUS_CODES[error.stateData.code] + "<br>";
         // console.log(error);
         count++;
         document.getElementById("demo").innerHTML = count;
         arr_complete.push(error);
      });
      generator.start();
   }else{
      alert("Vous n'avez pas renseigné une URL valide.");
   }
   return false;
}
function dialogFolder(){
   let val = (dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] }));
   document.getElementById("folder").setAttribute('value',val);
}

function roundToTwo(num){
   return +(Math.round(num + "e+2") + "e-2") || 0;
}
