import ReconnectingWebSocket from "reconnecting-websocket";
import networkConfiguration from "../../config.js";
import usePeerStore from "../../store/peer";

export default {
    install(app) {
        console.log("invoked initialize websocket plugin");
        app.config.globalProperties.$initializePeer?.then(() => {
            let peerStore = usePeerStore();
            let friendStore = useFriendStore();
            let token = uni.getStorageSync('token');
            let {host, port, path} = {...networkConfiguration.webSocketServer};

            let connection = new ReconnectingWebSocket(`ws://${host}:${port}${path}/${peerStore.localPeer.id}`, [token]);

            connection.onmessage = event => {
                let message = JSON.parse(event.data);
                friendStore.onlineList = message;
                console.log("webSocketConnection.onmessage:", message);
            };

            connection.onclose = event => {
                console.log("webSocketConnection.onclose:", event);
                showToast("network connection closed");
            };

            connection.onerror = event => {
                console.log("webSocketConnection.onerror:", event);
                showToast("network connection error");
            };

            connection.onopen = event => {
                console.log("webSocketConnection.onopen:", event);
            };
        });
    }
};