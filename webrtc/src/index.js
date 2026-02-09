let peers = [];

export default {
  async fetch(request) {
    if (request.headers.get("Upgrade") === "websocket") {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      
      server.accept();
      peers.push(server);
      console.log("Peer connected, total peers:", peers.length);
      
      server.addEventListener("message", e => {
        console.log("Relaying message to", peers.length - 1, "other peers");
        peers.forEach(p => {
          if (p !== server) {
            try {
              p.send(e.data);
              console.log("Sent to peer");
            } catch (err) {
              console.error("Failed to send:", err);
            }
          }
        });
      });
      
      server.addEventListener("close", () => {
        peers = peers.filter(p => p !== server);
        console.log("Peer disconnected, remaining:", peers.length);
      });
      
      return new Response(null, { status: 101, webSocket: client });
    }
    
    return new Response("Signaling Server");
  }
};