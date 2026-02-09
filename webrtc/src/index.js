// Cloudflare Worker - signaling.js
let peers = [];

export default {
  async fetch(request) {
    if (request.headers.get("Upgrade") === "websocket") {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      
      server.accept();
      peers.push(server);
      
      server.addEventListener("message", e => {
        peers.forEach(p => p !== server && p.send(e.data));
      });
      
      server.addEventListener("close", () => {
        peers = peers.filter(p => p !== server);
      });
      
      return new Response(null, { status: 101, webSocket: client });
    }
    
    return new Response("OK");
  }
};