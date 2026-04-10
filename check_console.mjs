import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log(`BROWSER CONSOLE: ${msg.type()} - ${msg.text()}`));
  page.on('pageerror', error => console.log(`BROWSER ERROR: ${error.message}`));

  await page.goto('http://localhost:4173/');
  
  // Wait to see if errors pop up
  await page.waitForTimeout(2000);

  // Take a screenshot just in case we need it visually later
  await page.screenshot({ path: 'debug_blank_page.png' });

  await browser.close();
  console.log("Done checking.");
})();
