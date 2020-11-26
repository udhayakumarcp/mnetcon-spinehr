const puppeteer = require('puppeteer');
const schedule = require('node-schedule');
const inId = "#ctl00_BodyContentPlaceHolder_navMarkIn";
const outId = "#ctl00_BodyContentPlaceHolder_navMarkOut";

(async () => {
    console.log("App started...");
    schedule.scheduleJob('00 30 8 * * 1-6', () => { mark(inId) });
    schedule.scheduleJob('00 15 18 * * 1-6', () => { mark(outId) });
    mark(outId);
})();

async function mark(id) {
    // Browser Setup
    const browser = await puppeteer.launch({
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 768 });

    //TO read Dialog
    page.on('dialog', async dialog => {
        console.log("From Dialog : ", dialog.message());
        await dialog.dismiss();
        console.log("Dialog Closed.");
    });
    //Go to Website
    await page.goto('https://mnetcon.spinehr.in/', { waitUntil: 'networkidle0' }).catch(error => console.error(error));
    console.log("Login page loaded");

    //log In
    await page.$eval('#userid', el => el.value = 594);
    await page.$eval('#pwd', el => el.value = "Netcon@991");
    await page.click("#btnLogin");

    //Go To Attendance Page
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(error => console.error(error));
    console.log("loged in and Home page Loaded");
    await page.click("#ui-accordion-leaveAccord-panel-0 div:nth-child(4) a");

    //Go To Mark Option Page
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(error => console.error(error));
    console.log("mark Options page loaded");
    await page.click(id);

    //Mark
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(error => console.error(error));
    console.log("Marking page loaded");
    await page.click("#ctl00_BodyContentPlaceHolder_btnAddNew");
    console.log("Mark clicked");

    //Confirmation
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(error => console.error(error));
    console.log("Marked successfully.")
    await page.screenshot({ path: './images/screenshots/' + await dateNow() + '.jpg' });

    await browser.close();

}


async function dateNow() {
    const date = new Date()
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return year + "-" + month + "-" + day + "  " + hour + "." + minute + "." + second;
}
