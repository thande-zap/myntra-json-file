import puppeteer from "puppeteer-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import { promises as fs } from "fs";
puppeteer.use(stealth());

const url = "https://www.myntra.com/accessories?f=Categories%3AGold%20Coin";

async function webpage() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const cookiesString = await fs.readFile("cookies/cookies.json");
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
    await page.goto(url, {
      waitUntil: "networkidle2",
    });
    const source = await page
      .$eval("body > script:nth-child(5)", (element) => element.innerHTML)
      .replace("window.__myx = ", "");
    fs.writeFile("/myntra.json", source);

    await browser.close();
  } catch (error) {
    console.log(error);
  }
}

webpage();
