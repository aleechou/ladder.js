require("./store.js")

;
(async() => {

    if ($store.config.debug)
        qnode.window.openConsole()

    var mainwnd = await qnode.window.create()
    await mainwnd.load("file://" + __dirname + "/mainwnd/mainwindow.html", ()=>{
        mainwnd.bridgeShadowObject($store, ($store) => {
            window.$store = $store
            initApp()
        })
    })
    mainwnd.show()



})()