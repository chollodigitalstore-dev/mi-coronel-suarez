const { chromium } = require('C:/Users/Ari/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs/promises');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  try {
    const page = await browser.newPage();
    await page.route('https://guide.test/**', async route => {
      const p = new URL(route.request().url()).pathname;
      if (p.endsWith('.js')) return route.fulfill({contentType:'text/javascript',body:''});
      try { await route.fulfill({body:await fs.readFile('public'+(p==='/'?'/index.html':p)),contentType:p.endsWith('.css')?'text/css':'text/html'}); }
      catch { await route.fulfill({status:404,body:''}); }
    });
    for (const width of [390,768,900,1024,1280,1366,1440,1500,1536,1920]) {
      await page.setViewportSize({width,height:900});
      await page.goto('https://guide.test/');
      await page.evaluate(() => {
        document.querySelector('#weatherText').textContent='Hoy 21° · Mañana 11°/23°';
        document.querySelector('#pharmacyHeaderText').textContent='Farmacia Coronel Suárez';
        document.querySelector('#currentDate').textContent='mié, 21 oct';
        document.querySelector('#userMenu').hidden=false;
        document.querySelector('#userName').textContent='Ariel';
      });
      await page.evaluate(() => document.fonts.ready);
      const boxes = await page.locator('.site-header .brand,.weather-widget,.pharmacy-widget,#mainNavigation > .button,#userMenu').evaluateAll(els => els.filter(e=>e.getClientRects().length).map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom};}));
      for (let i=0;i<boxes.length;i++) for (let j=i+1;j<boxes.length;j++) {
        const a=boxes[i],b=boxes[j];
        assert.ok(!(a.x<b.right-1 && a.right>b.x+1 && a.y<b.bottom-1 && a.bottom>b.y+1),`${width}: overlap ${i}/${j}`);
      }
      if (width > 760) {
        const centers = boxes.map(b => (b.y+b.bottom)/2);
        assert.ok(Math.max(...centers)-Math.min(...centers)<3, `${width}: header must stay on one row`);
      }
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}: overflow`);
      if(width===1280) await page.locator('.site-header').screenshot({path:'tmp-screens/header-1280.png'});
      console.log(`${width}: no overlap or horizontal overflow`);
    }
  } finally { await browser.close(); }
})();
