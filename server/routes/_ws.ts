const clients: any[] = [];

export default defineWebSocketHandler({
    open(peer) {
        if (!clients.includes(peer)) {
            clients.push(peer);
        }

        console.log("[ws] open", peer);
    },

    message(peer, message) {
        if (message.text().includes("ping")) {
            peer.send({
                type: 'heartbeat',
                content: 'pong',
            });
            return
        }

        clients.forEach(client => {
            client.send(message.text());
        })
    },

    close(peer, event) {
        console.log("[ws] close", peer, event);
    },

    error(peer, error) {
        console.log("[ws] error", peer, error);
    },
});

