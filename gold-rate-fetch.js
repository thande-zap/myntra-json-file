import puppeteer from 'puppeteer-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import { url } from './url.js';
puppeteer.use(stealth());

let items = [];
async function fetcher() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //MMTC PAMP CODE HERE
    await page.goto(url[0], {
      waitUntil: 'networkidle2',
    });
    let el0 = await page.$eval(
      '#fragment-9402-kpwp > div > div > div.today-mmtcpamp-value.centered-div > span',
      (element) => parseFloat(element.innerHTML.replace(/,/g, ''))
    );

    items.push({ name: 'MMTC PAMP', '24K': el0, '22K': el0 * 0.916 });

    //GADGETS360 CODE HERE
    await page.goto(url[1], {
      waitUntil: 'networkidle2',
    });
    const el1 = await page.$eval(
      '#carat24 > div._cptbl._cptblm > table > tbody > tr:nth-child(1) > td._lft',
      (element) => parseFloat(element.innerHTML.replace(/[₹,]/g, ''))
    );

    items.push({ name: 'GADGET360', '24K': el1, '22K': el1 * 0.916 });

    //IBJA CODE HERE
    await page.goto(url[2], {
      waitUntil: 'networkidle2',
    });
    const el2 = await page.$eval('#lblrate24K', (element) =>
      parseFloat(element.innerHTML.replace(/,/g, ''))
    );

    items.push({ name: 'IBJA RATES', '24K': el2, '22K': el2 * 0.916 });

    //ECONOMIC TIMES CODE HERE
    await page.goto(url[3], {
      waitUntil: 'networkidle2',
    });
    const el3 = await page.$eval(
      '#goldHeader > div > div.gold_info > div.carat_24 > div.with_lborder.change.up > div > ul > li > span.ltp_block > span',
      (element) => parseFloat(element.innerHTML.replace(/,/g, ''))
    );

    items.push({
      name: 'ECONOMIC TIMES',
      '24K': el3 / 10,
      '22K': (el3 / 10) * 0.916,
    });

    fs.writeFile('gold-rate.json', JSON.stringify(items), 'utf-8', (err) => {
      console.log(err);
    });
    await browser.close();
  } catch (error) {
    console.log(error);
  }
}
fetcher();
