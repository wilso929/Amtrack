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

    const data = {ProductTitle: name, URL: url, Price: 0.0}

    return data;
}

run_check = async function(username,password, array){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.amazon.ca/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.ca%2Fs%3Fk%3Dlogin%26ref%3Dnav_ya_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=caflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&');
    await page.waitForSelector('#ap_email');
    await page.type('#ap_email', username);
    await page.click('#continue');
    await page.waitForSelector('#ap_password');
    await page.type('#ap_password', password);
    await page.click('#signInSubmit');
    await page.waitForNavigation();


    for(i = 0; i<array.length; i++){
        await page.goto(array[i].URL);
        await page.waitForSelector('#priceblock_ourprice');
        const price = await page.evaluate(() => {
            return document.getElementById("priceblock_ourprice").innerText;
        })
        console.log(array[i].ProductTitle+", "+price+", "+array[i].Price);
        console.log(Number(price.replace(/[^0-9.-]+/g,"")));
        if(Number(price.replace(/[^0-9.-]+/g,"")) <= array[i].Price){
            await page.click('#add-to-cart-button');
        }
    }
    await browser.close();
    
}


module.exports = { getname, run_check };


