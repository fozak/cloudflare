export class SignalingRoom {
  constructor(state) {
    this.state = state;
    this.sessions = [];
  }

  async fetch(request) {
    if (request.headers.get("Upgrade") === "websocket") {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      
      server.accept();
      this.sessions.push(server);
      console.log("Session added, total:", this.sessions.length);
      
      server.addEventListener("message", e => {
        console.log("Broadcasting to", this.sessions.length - 1, "sessions");
        this.sessions.forEach(s => {
          if (s !== server && s.readyState === 1) {
            s.send(e.data);
          }
        });
      });
      
      server.addEventListener("close", () => {
        this.sessions = this.sessions.filter(s => s !== server);
        console.log("Session removed, remaining:", this.sessions.length);
      });
      
      server.addEventListener("error", e => {
        console.error("WebSocket error:", e);
      });
      
      return new Response(null, {status: 101, webSocket: client});
    }
    return new Response("OK");
  }
}

export default {
  async fetch(request, env) {
    if (request.headers.get("Upgrade") === "websocket") {
      const id = env.SIGNALING.idFromName("default-room");
      const stub = env.SIGNALING.get(id);
      return stub.fetch(request);
    }
    return new Response("Signaling Server");
  }
};