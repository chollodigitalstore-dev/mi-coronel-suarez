const { chromium } = require('C:/Users/Ari/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs/promises');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try {
  const page = await browser.newPage();
  await page.route('https://guide.test/**',async route=>{
   const file = new URL(route.request().url()).pathname;
   if(file.endsWith('.js')) return route.fulfill({body:'',contentType:'text/javascript'});
   try { return route.fulfill({body:await fs.readFile('public'+(file==='/'?'/index.html':file)),contentType:file.endsWith('.css')?'text/css':'text/html'}); }
   catch { return route.fulfill({status:404,body:''}); }
  });
  for (const width of [320,390,760,761,1024,1101,1317,1440,1920]) {
   for (const loggedIn of [false,true]) {
    await page.setViewportSize({width,height:900});
    await page.goto('https://guide.test/');
    await page.evaluate(loggedIn=>{
     document.querySelector('#userMenu').hidden=!loggedIn;
     document.querySelector('#userName').textContent='Ariel';
     document.querySelector('#userAvatar').remove();
     document.querySelector('#currentDate').textContent='lun, 12 oct';
     document.querySelector('#weatherText').textContent='Hoy 13° · Mañana 9°/15°';
     document.querySelector('#pharmacyHeaderText').textContent='Farmacia Del Pueblo';
    },loggedIn);
    await page.evaluate(()=>document.fonts.ready);
    const collisions=await page.evaluate(()=>{
     const elements=[...document.querySelectorAll('.site-header > .brand,.site-header > .weather-widget,.site-header > .pharmacy-widget,.site-header nav > *')].filter(el=>el.getClientRects().length);
     const result=[];
     for(let i=0;i<elements.length;i++) for(let j=i+1;j<elements.length;j++) {
      const a=elements[i].getBoundingClientRect(), b=elements[j].getBoundingClientRect();
      if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1 && Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1) result.push([elements[i].className,elements[j].className]);
     }
     return result;
    });
    assert.deepEqual(collisions,[],`${width} loggedIn=${loggedIn}`);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);
    if(width===1317 && loggedIn) await page.locator('.site-header').screenshot({path:'tmp-screens/header-fixed.png'});
   }
   console.log(`${width}px: no overlaps, logged in/out`);
  }
 } finally { await browser.close(); }
})();
