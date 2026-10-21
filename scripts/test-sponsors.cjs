const { chromium } = require('C:/Users/Ari/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs/promises');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try {
  const page=await browser.newPage();
  await page.route('https://guide.test/**',async route=>{
   const file=new URL(route.request().url()).pathname;
   if(file==='/app.js') return route.fulfill({contentType:'text/javascript',body:"import './local-sponsors.js';"});
   try{return route.fulfill({body:await fs.readFile('public'+(file==='/'?'/index.html':file)),contentType:file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':'text/html'});}catch{return route.fulfill({status:404,body:''});}
  });
  for(const width of [320,390,760,1024,1440]){
   await page.setViewportSize({width,height:900});await page.goto('https://guide.test/');await page.locator('#localSponsors').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('#localSponsors article').count(),3);
   assert.deepEqual(await page.locator('#localSponsors a').evaluateAll(els=>els.map(e=>e.getAttribute('href'))),['tel:+542926516921','https://radioplay953.com.ar/','tel:+542926547663']);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   assert.ok(await page.locator('#localSponsors a').evaluateAll(els=>els.every(e=>e.getBoundingClientRect().height>=44)));
   if([390,1440].includes(width))await page.locator('#localSponsors').screenshot({path:`tmp-screens/sponsors-${width}.png`});
   await page.evaluate(()=>document.body.classList.add('listing-route-page'));assert.equal(await page.locator('#localSponsors').isVisible(),false);
   console.log(`${width}px OK: 3 sponsors, exact links, no overflow, touch targets, hidden on listing routes`);
  }
 }finally{await browser.close();}
})();
