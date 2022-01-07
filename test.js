
const scraper = require('./scrape.js');

const url = "https://www.amazon.ca/gp/product/B088CK6GP1?pf_rd_r=F20ADBW6SQS0H1MCSSMC&pf_rd_p=05326fd5-c43e-4948-99b1-a65b129fdd73&pd_rd_r=d92fb039-6465-47e1-bda2-6d75b9f5104e&pd_rd_w=UeD0T&pd_rd_wg=SoFi6&ref_=pd_gw_unk";
const name = scraper.getname(url);
name.then(function(resualt){
    console.log(typeof resualt);
    console.log(resualt);
})
