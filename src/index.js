require("./store")

;
(async() => {

    if ($store.config.debug)
        qnode.window.openConsole()

    var mainwnd = await qnode.window.create()
    await mainwnd.load("file://" + __dirname + "/mainwnd/mainwindow.html")
    mainwnd.bridgeShadowObject($store, (store) => {
        window.$store = store
        initApp()
    })
    mainwnd.show()


    var a = 111
    var b = "bbb"
    var c = {
        a: a,
        b: b
    }
    var ret = await mainwnd.run(() => {
        c.b = a
        c.a = b
        resolve(c)
    }, { a, b, c })

    console.log(">>>>>", ret)


})()

setInterval(() => {}, 1000)