import puppeteer from "puppeteer-core";
const CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const b=await puppeteer.launch({executablePath:CHROME,headless:true,args:["--disable-gpu","--no-sandbox","--force-device-scale-factor=1"]});
const p=await b.newPage();
await p.setExtraHTTPHeaders({"x-dev-preview":"1"});
await p.setViewport({width:1440,height:1200});
await p.goto("http://localhost:3000/rca",{waitUntil:"networkidle0",timeout:30000});
await new Promise(r=>setTimeout(r,1200));
await p.screenshot({path:"/tmp/rca_full.png",fullPage:true});
// also a tight crop of the ground scene zone
const gz=await p.$('[data-scene-zone="ground"]');
if(gz){await gz.screenshot({path:"/tmp/rca_ground.png"});}
console.log("done", p.url());
await b.close();
