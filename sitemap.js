const SitemapGenerator = require('sitemap-generator');
const { dialog } = require('electron').remote
const http = require('http')

function launchSitemap(){
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
   console.log(pMap);
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
      });
      generator.on('add', (data) => {
         document.getElementById("demo").innerHTML += data.url + " [Info: Code=" + data.stateData.code +", Message= " + http.STATUS_CODES[data.stateData.code] + "]<br>";
         console.log(data);
      });
      generator.on('error', (error) => {
         document.getElementById("demo").innerHTML += error.url + " : " + http.STATUS_CODES[error.stateData.code] + "<br>";
         console.log(error);
         // => { code: 404, message: 'Not found.', url: 'http://example.com/foo' }
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
