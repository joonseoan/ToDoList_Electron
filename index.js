console.log("index.js starts here");

const electron = require('electron');

// "Menu" object is used to create a custom menu placed in electron app.
const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;

// Same thing as above to access addWindow object and to communicate with Main Window(HTML).
let addWindow; 

app.on('ready', () => {

    mainWindow = new BrowserWindow({});
    
    // {__dirname }: current working directory of HTML files.
    mainWindow.loadURL(`file://${__dirname}/main.html`);
    // mainWindow.loadURL('https://koreanz.tv');

    // 'closed' is a built-in event handler in Electron.
    // In other words, 'closed' is a built-in name to handle the event in Electron.

    // "mainWindow" listen to 'closed' event when the user closes the window,
    // it executes app.quit() method to close down all the windows related to that mainWindow. 
    // close all window when the main window is closed
    mainWindow.on('closed', () => app.quit()); 

    // ["menuTemplate"]
    // It is a kind of an intelligent object that describes listerally "Mene Template"
    // Still not done for creating menu here. 

    // [However, troubles are]
    // 1) the previously existing menu disapeared
    //    because "mainMenu" above diplaces that previous menu.
    // 2) "reload" does not work. inspect does not work.
    //    In other words, the previously existing menu is replaced with "mianMenu" below.     
    //    That means that the functions of the key strokes (that are hot keys) are broken aw well.
    //    For the application maintenace, we need to setup the key bindings as well.     
     
    // Tells what we would like to do in Menu object
    const mainMenu = Menu.buildFromTemplate(menuTemplate); 
     
     // Ready to create "menu".
     Menu.setApplicationMenu(mainMenu); // Create "menu".

});

// We we can start creating a detail menu

// Whenever we create "Menu", the first thing to do is a Menu template.
// "menuTemplate" can be an entire menu bar on the top
// It must starts an array because there can be different menues.

// 1)
/*
const menuTemplate = [
 
    // A single object of the menuTemplate coresponds to 
    // a single drop-down menu on the top.
    {
        label: 'File',
        submenu: [
            {
                 label: 'new Todo' 
            }
        ] 
    }

];
*/

/**
     * We need to check out the cross-operation platform.
     * For intance, in OSX of Apple, "File" menu does not appear in the right spot.
     * "Electron" dispalces "File" location then, also, "submenu" is going to be placed in "Electron", not "File"
     * For this reason, we need to develop the a cross-functional application.
     * 
     * [ Environment variable ] : should be deployed to resolve this issue.
     * 
     * In terminal, type:
     * 1) node // It will be a new type enviroment that makes javaScript work.
     * 2) process.platform // => 'darwin' ==> OSX, 'win32' refering to Window
     * 
     * if (process.platform === 'darwin') {

        // "unshift" here means that it push the first empty objec"{}" into the "menuTemplate" ojbect.
        // Therefore, it prevents "Electron" displaces "File" libel.
        menuTemplate.unshift({});


        [FYI]
        Array.unshift()
        : The unshift() method adds new items to the beginning of an array, and returns the new length.

        var fruits = ["Banana", "Orange", "Apple", "Mango"];
        document.getElementById("demo").innerHTML = fruits;

        function myFunction() {
        fruits.unshift("Lemon", "Pineapple");
        document.getElementById("demo").innerHTML = fruits;
}


    }
 */

// new window for the 'New to do' menu
function createAddWindow() {

    // {} is used to make window option
    addWindow = new BrowserWindow ({
        width: 300,
        height: 200, //px
        title: 'Add New Todo'
        
    });

    addWindow.loadURL(`file://${__dirname}/add.html`);

    // For the garbage collection, addWindow should be null after it closes.
    // Then we can use a new BrowserWindow with "addWindow" object reference.
    addWindow.on('closed', () => addWindow = null);

}



// todo is a data got sent along with. 
// In other words, it is "value" from "add.html" 
ipcMain.on('todo:add', (event, todo) => {

    // console.log('todo:', todo);

    mainWindow.webContents.send('todo:add', todo);

    // After click "add" button, 
    // the add window should disappear "automatically".
    // [FYI] : It is differnt from "app.quit()" that the user arbitarly closes down the window 
    // Don't be confused with "quit()" which works in menu bar.
    addWindow.close();

    /*
    [ Garbage Collection ]
    JavaScript does not have a function Garbage Collection
    
    Actually, when we use "close()", 
    that theoretically means that we will not use 
    "addWindow = BrowserWindow" anymore.
    (Instead, we will use brand new "BrowserWindow" version 
    if it is necessary)
    
    If the old "BrowserWindow" still remmains in the code 
    with no activity,
    it just takes over memory space. 
    So we need to control and dismiss this garbage.

    The best way to dismiss the old version BrowserWindow,
    is that "null" or/and the brand new "BrowserWindow" is assigned 
    to that"addWindow"
    */
    
    // 1)
    // addWindow = null;

    //or otherwise, write the code above in "createAddWindow()""
    /*
    addWindow.on('closed', ()=> {

        addWindow = null;

    });
    */



});

const menuTemplate = [

    {
        label: 'File',
        submenu: [
            {
                label: 'New Todo',
                 
                 // connection to addWindow object in createAddWindow() above
                 click() { createAddWindow(); }
                 
            },
            {
                label: 'Clear List',

                // the object, "mainWindow" independantly is used again to control "main.html".
                // my coding: click() { mainWindow.webContents.send('todo:completeClear', todo = ""); }
                // Steve
                click() { mainWindow.webContents.send('todo:completeClear'); }

            },
            {
                label: 'Quit',
                // accelerator : property of hot key commands
                // OSX:  
                // accelerator: 'Alt+Command+Q',

                // for both platforms
                //1)
                /*
                accelerator: (() => {
                    if (process.platform === 'darwin') {
                        return 'Command + Q';
                    } else {
                        return 'Cntl + Q';
                    }
                }) (),
                */

                // 2) 
                // Tenary statement
                accelerator: (process.platform === 'darwin') ? 'Command + Q' : 'Ctrl + Q',

                // click() : menu click.
                click() {

                    // implement "app" and its method "quit()" 
                    app.quit();

                }
            }

        ] 
    }

];

// ---------------------------------------
// checking statement shoulbe be here at the end of code


if (process.platform === 'darwin') {

    // "unshift" here means that it push the first empty objec"{}" into the "menuTemplate" ojbect.
    // Therefore, it prevents "Electron" displaces "File" liabel.
    menuTemplate.unshift({});

}

// "process" here almost same as window in a normal browser 
// in most javascript project, "NODE.ENV" is one four below.
/*
    NODE.ENV = 'production
                development
                staging
                test

    In this case, it can be in a running development environment
*/ 

if (process.env.NODE_ENV !== 'production') {

    menuTemplate.push({ // push => the last elenent that is right side to 'File'

        
        label: 'Tools',
        submenu : [
            // "role" is a function preset in Electron.
            // "role" is able to define value, "reload"
            // that it might be a conventional "reload" function.
            // It automatelly deinfes lable, accelerator, 
            // and Click() 

            {
                role : 'reload'
            },
            {
            
            // it is not a preset
            label : 'DeView',
            accelerator : process.platform === 'darwin'
            ? 'Command + Alt + I' : 'Ctrl + Shift + I',
            
            //'focusedWindow': mouse clicked window
            // Do not take care of "item" now
            click(item, focusedWindow) {

                // "toggleDevTools()" : Chrom "Inspect"
                focusedWindow.toggleDevTools();

            }
            }

        ]

    });

}
