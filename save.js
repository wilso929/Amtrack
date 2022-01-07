const puppeteer = require('puppeteer')

getname = async function(url){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('#productTitle')
    const name = await page.evaluate(() => {
       return document.getElementById("productTitle").innerText;
    })
    await browser.close();
    return name;
}



module.exports = { getname };
