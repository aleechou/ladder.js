var SshClient = require('ssh2').Client


class Tunnel {

    constructor(options) {

        this.socket = null
        this.isReady = false
        this.watingTunnelReadyForwarders = []
        this.idleForwards = {}

        this.socket = new SshClient()
            .on('error', function(err) {
                console.error("tunnel error:", err)
            })
            .on('close', function() {

                this.isReady = false

                console.log("tunnel closed")
            })
            .on('ready', () => {
                console.log("tunnel ready")

                this.isReady = true

                for (var [upstream, forwarder] of this.watingTunnelReadyForwarders) {
                    forwarder.cat(upstream)
                }
                this.watingTunnelReadyForwarders = []
            })
        this.socket.connect(options)
    }

    forward(upstream, distHost, distPort) {

        var distKey = distHost + ":" + distPort
        if (this.idleForwards[distKey] && this.idleForwards[distKey].length) {
            console.log("reuse forwarder")
            forwarder = this.idleForwards[distKey].shift()
        } else {
            var forwarder = new Forward(this, distHost, distPort)
            forwarder.distKey = distKey
        }

        if (!this.isReady) {
            this.watingTunnelReadyForwarders.push([upstream, forwarder])
        } else {
            forwarder.cat(upstream)
        }

        return forwarder
    }

    forwarderIdle(forwarder) {
        console.log("forwarder is idle")
        if (!this.idleForwards[forwarder.distKey]) {
            this.idleForwards[forwarder.distKey] = []
        }
        this.idleForwards[forwarder.distKey].push(forwarder)
    }


}


class Forward {

    constructor(tunnel, distHost, distPort) {

        this.distHost = distHost
        this.distPort = distPort

        this.tunnel = tunnel

        this.upstream = null
        this.downstream = null

        this.isReady = false

        this.waitingReadyBuffer = []
        this.readyOnceHandles = []
    }

    async cat(upstream) {

        if (this.upstream == upstream) {
            console.log("cating same upstream to forwarder")
            return
        }

        this.upstream = upstream
        this.upstream.on("close", () => {
            this.upstream
        })

        if (!this.isReady || !this.downstream) {
            try {

                this.downstream = await this.connectDownstream()

            } catch (error) {
                console.error("forward exception:", error)

                this.upstream.end()
                this.isReady = false

                return
            }
        }

        if (this.waitingReadyBuffer.length) {
            console.log("write waiting", this.waitingReadyBuffer.length, "buffers")
            for (var buff of this.waitingReadyBuffer) {
                this.downstream.write(buff)
            }
            this.waitingReadyBuffer = []
        }

        this.downstream.on("data", (data) => {
            console.log("<< respense", data.length)
            console.log(data.toString())
        })

        // 建立双向管道
        this.upstream.pipe(this.downstream)
        this.downstream.pipe(this.upstream)

        this.downstream
            .on('close', () => {
                this.isReady = false

                // console.log("forward closed")
                if (this.upstream) {
                    this.upstream.end()
                    this.upstream = null
                }

                if (this.downstream) {
                    var downstream = this.downstream
                    this.downstream = null

                    setTimeout(() => {
                        console.log("clear all listeners of downstream")
                        downstream.removeAllListeners("close")
                        downstream.removeAllListeners("data")
                        downstream.removeAllListeners("error")
                    }, 0)
                }
            })
            .on("error", (error) => {
                console.error("forward error:", error)
            })

        // 上游(客户端)结束，释放下游链接(可重用)
        this.upstream.on('close', () => {
            this.upstream = null
            this.tunnel.forwarderIdle(this)
        })

        return
    }

    connectDownstream() {
        return new Promise((resolve, reject) => {
            try {
                console.log("start forward to", this.distHost + ":" + this.distPort, " ...")
                var startTime = Date.now()
                this.tunnel.socket.forwardOut(
                    this.upstream.remoteAddress,
                    this.upstream.remotePort,
                    this.distHost,
                    this.distPort,
                    (err, stream) => {
                        console.log("forward ready", Date.now() - startTime)
                        if (err)
                            reject(err)
                        else {
                            this.isReady = true

                            if (this.readyOnceHandles.length) {
                                for (var callback of this.readyOnceHandles) {
                                    callback()
                                }
                            }

                            resolve(stream)
                        }
                    });
            } catch (error) {
                reject(error)
            }
        })
    }

    write(data) {
        if (this.isReady) {
            this.downstream.write(data)
        } else {
            this.waitingReadyBuffer.push(data)
            console.log("write buffer waiting ready")
        }
        return this
    }

    ready(callback) {
        if (this.isReady) {
            callback()
        } else {
            this.readyOnceHandles.push(callback)
        }
    }

}

exports.Tunnel = Tunnel
exports.Forward = Forward