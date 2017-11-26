$store = qnode.bridge.object({
    config: {
        tunnels: [],
        
        debug: true
    },

    tunnelStatus: {} ,

    ui: {
        mainwnd: {
            selectedTab: ""
        }
    }
})