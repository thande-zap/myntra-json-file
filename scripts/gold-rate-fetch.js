import puppeteer from "puppeteer-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { url } from "../db/url.js";
puppeteer.use(stealth());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let items = {};
async function fetcher() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //MMTC PAMP CODE HERE
    // await page.goto(url.mmtc, {
    //   waitUntil: "networkidle2",
    // });
    // let el0 = await page.$eval(
    //   "#fragment-9402-kpwp > div > div > div.today-mmtcpamp-value.centered-div > span",
    //   (element) => parseFloat(element.innerHTML.replace(/,/g, ""))
    // );
    // let el0 = (await page.$x(
    //   "/html/body/div[3]/div/div[1]/div/div[2]/div[3]/div[1]/div[1]"
    // ),
    // (element) => parseFloat(element.innerHTML()))[0];
    // Correctly using XPath to fetch the value
    // let elements = await page.$x(
    //   "/html/body/div[3]/div/div[1]/div/div[2]/div[3]/div[1]/div[1]"
    // );

    // let el0 = await page.evaluate(
    //   (element) => parseFloat(element.innerHTML.replace(/,/g, "")),
    //   elements[0]
    // );
    // items.mmtc = el0;

    // items.mmtc = { Source: "MMTC PAMP", "24K": el0, "22K": el0 * 0.916 };

    //GADGETS360 CODE HERE
    await page.goto(url.gadgets360, {
      waitUntil: "networkidle2",
    });
    const el1 = await page.$eval(
      "#carat24 > div._cptbl._cptblm > table > tbody > tr:nth-child(1) > td._lft",
      (element) => parseFloat(element.innerHTML.replace(/[₹,]/g, ""))
    );
    items.gadgets360 = { Source: "GADGETS360", "24K": el1, "22K": el1 * 0.916 };

    //IBJA CODE HERE
    await page.goto(url.ibja, {
      waitUntil: "networkidle2",
    });
    const el2 = await page.$eval("#lblrate24K", (element) =>
      parseFloat(element.innerHTML.replace(/,/g, ""))
    );
    items.ibja = { Source: "IBJA RATES", "24K": el2, "22K": el2 * 0.916 };

    //ECONOMIC TIMES CODE HERE

    try {
      await page.goto(url.et, {
        waitUntil: "networkidle2",
      });
      const el3 = await page.$eval(
        "#goldHeader > div > div.gold_info > div.carat_24 > div.with_lborder.change.up > div > ul > li > span.ltp_block > span",
        (element) => parseFloat(element.innerHTML.replace(/,/g, ""))
      );
      items.et = {
        Source: "ECONOMIC TIMES",
        "24K": el3 / 10,
        "22K": (el3 / 10) * 0.916,
      };
    } catch (error) {
      items.et = {
        Source: "ECONOMIC TIMES",
        "24K": null,
        "22K": null,
      };
    }

    fs.writeFile(
      "../db/gold-rate.json",
      JSON.stringify(items),
      "utf-8",
      (err) => {
        if (err) console.log(err);
      }
    );
    await browser.close();
  } catch (error) {
    console.log(error);
  }
}
fetcher();
