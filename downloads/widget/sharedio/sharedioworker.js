importScripts("/js/guard/obf/trcws.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.5.1/socket.io.min.js");

let ioChannelConnections = {};

function createIOConnection(channelId) {
    if (ioChannelConnections[channelId]) {
        console.log("[SharedIO] ChannelID already connected", channelId);

        // Re-emit login to get widget settings
        loginIO(ioChannelConnections[channelId], channelId);
        return;
    }

    ioChannelConnections[channelId] = new io({
        transports: ["websocket"],
        upgrade: false,
        query: {
            appType: "widget",
            shared: true
        }
    });

    ioChannelConnections[channelId].on("connect", () => {
        console.info(`[SharedIO] [${channelId}] [IOCONNECTED]`);
        loginIO(ioChannelConnections[channelId], channelId);
    })

    ioChannelConnections[channelId].on("reconnect", () => {
        console.info(`[SharedIO] [${channelId}] [IORECONNECTED]`);
        loginIO(ioChannelConnections[channelId], channelId);
    })

    ioChannelConnections[channelId].on("error", (err) => {
        console.info(`[SharedIO] [${channelId}] [IOERROR] ${err}`);
    })
}

function loginIO(io, channelId) {
    io.emit("login", {
        channelId,
        appType: "widget",
        receiveChat: true,
        receiveGift: true
    })
}

function pipeEventToPort(channelId, eventName, port) {
    let listenerFn = function () {
        port.postMessage({
            name: "ioEvent",
            params: {
                eventName: eventName,
                eventData: Array.prototype.slice.call(arguments)
            }
        });
    }

    ioChannelConnections[channelId].on(eventName, listenerFn);
    return { eventName, listenerFn };
}

console.log("[SharedIO] Worker Created!");

let clientCount = 0;

onconnect = (e) => {
    const port = e.ports[0];

    let channelId = null;
    let pipedListeners = [];

    console.log("[SharedIO] Worker Connected!");

    port.addEventListener('message', (e) => {
        let command = e.data;

        console.log("[SharedIO] Command received:", command);

        switch (command.name) {
            case "connect":
                if (typeof command.params.channelId !== "number") {
                    return console.warn("[SharedIO] Called connect without channelId!");
                }

                createIOConnection(command.params.channelId);
                channelId = command.params.channelId;
                clientCount += 1;
                console.info(`[SharedIO] [${channelId}] [CONNECT]`);
                port.postMessage({
                    name: "connectCallback",
                    params: {
                        clientCount,
                        socketChannels: Object.keys(ioChannelConnections),
                        socketConnected: ioChannelConnections[channelId].connected
                    }
                });
                break;



            case "attachEvent":
                if (channelId === null) {
                    return console.warn("[SharedIO] Cannot pipe io event, socketio not initialized!");
                }

                pipedListeners.push(pipeEventToPort(channelId, command.params.eventName, port));
                console.info(`[SharedIO] [${channelId}] [ATTACH] ${command.params.eventName}`);
                break;



            case "disconnect":
                if (channelId === null) {
                    return console.warn("[SharedIO] Cannot disconnect, socketio not initialized!");
                }

                pipedListeners.forEach(({ eventName, listenerFn }) => {
                    ioChannelConnections[channelId].off(eventName, listenerFn);
                    console.info(`[SharedIO] [${channelId}] [DETACH] ${eventName}`);
                })

                clientCount -= 1;
                break;



            case "emit":
                if (channelId === null) {
                    return console.warn("[SharedIO] Cannot emit event, socketio not initialized!");
                }

                ioChannelConnections[channelId].emit(command.params.eventName, command.params.eventData)
                console.info(`[SharedIO] [${channelId}] [EMIT] ${command.params.eventName}: ${JSON.stringify(command.params.eventData)} `);
                break;
        }
    });

    port.start();
}