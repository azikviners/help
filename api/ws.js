import { Server } from "ws";

const clients = new Map();

export default function handler(req, res) {
  if (res.socket.server.ws) {
    res.end();
    return;
  }

  const wss = new Server({ noServer: true });
  res.socket.server.on("upgrade", (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
      const userId = new URL(req.url, "http://localhost").searchParams.get("user");
      clients.set(userId, ws);
      ws.on("close", () => clients.delete(userId));
    });
  });

  res.socket.server.ws = wss;
  res.end();
}

export function sendMessageToUser(userId, message) {
  const ws = clients.get(userId);
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(message));
  }
}
