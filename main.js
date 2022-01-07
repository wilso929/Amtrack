const electron = require('electron');
const scraper = require('./scrape.js');
const url = require('url');
const path = require('path');
const file = require('./file.js')
const { protocol } = require('electron');
const { stringify } = require('querystring');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

let items = require('./items.json');

process.env.NODE_ENV = 'production';

// Listen for the app to be ready


app.on('window-all-closed', function(){
    if(process.platform != 'darwin')
        app.quit();
});

app.on('ready', function(){
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    //load html
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainwindow.html'),
        protocol: 'file',
        slashes: true
    }));

    for(i = 0; i<items.length; i++){
        mainWindow.webContents.send('item:add', items[i].ProductTitle+' Budget: $'+items[i].Price);
    }

    //Quit app when closed
    mainWindow.on('close', function(e){
        file.writef(items);
        mainWindow.hide();
    });
    //build main menu
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //insert menu
    Menu.setApplicationMenu(mainMenu)

});

//Handel add window

function createAddWindow(){
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Item',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    //load html
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addwindow.html'),
        protocol: 'file',
        slashes: true
    }));

    //Garbage collection
    addWindow.on('close', function(){
        addWindow = null;
    });
}

function createLogWindow(){
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Item',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    //load html
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'login.html'),
        protocol: 'file',
        slashes: true
    }));

    //Garbage collection
    addWindow.on('close', function(){
        addWindow = null;
    });
}


//catch item:add

ipcMain.on('item:add', function(e, item){
    const name = scraper.getname(item.Link);
    name.then(function(resualt){
        resualt.Price = item.Price;
        let repeat = false;
        let i =0;
        while(i < items.length){
            if(items[i].ProductTitle == resualt.ProductTitle){
                repeat = true;
                break;
            }
            i++;
        }
        if(repeat == false){
            items.push(resualt);
            mainWindow.webContents.send('item:add', resualt.ProductTitle+' Budget: $'+resualt.Price);
        }
        
    })
    addWindow.close();
});

ipcMain.on('item:remove', function(e, item){
    let title = item.split(' Budget: $');
    let i = 0;
    while(items[i].ProductTitle != title[0]){
        console.log(i);
        i++;
    }
    items.pop(items[i]);
});

ipcMain.on('details', function(e, details){
    console.log(details["email"]);
    console.log(details["password"]);
    scraper.run_check(details["email"],details["password"],items);
    addWindow.close();
});



//create menu template

const mainMenuTemplate = [
    {
        label: 'Flie',
        submenu:[
            {
                label: 'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Item',
                click(){
                    while(items.length > 0) {
                        items.pop();
                    }
                    console.log(items);
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Run Check',
                accelerator: process.platform == 'darwin' ? 'Comamand+R' :
                'Ctrl+R',
                click(){
                    createLogWindow();   
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Comamand+Q' :
                'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

//If mac add empty object to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

// add dev tool if not in production

if(process.env.NODE_ENV === 'production'){
    mainMenuTemplate.push({
        label: "Developer Tools",
        submenu:[
            {
                label: 'Toggle Dev Tools',
                accelerator: process.platform == 'darwin' ? 'Comamand+I' :
                'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}