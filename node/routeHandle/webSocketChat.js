const { WebSocket } = require("ws")

const webSocketChat = (server) => {
  const wss = new WebSocket.Server({ server })
  const clients = new Set()
  const sendVaue = {
    historyChat: [],
    person: 0
  }
  wss.on('connection', (ws) => {
    clients.add(ws);
    sendVaue.person = clients.size
    const webmsg = Buffer.from(JSON.stringify(sendVaue))
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(webmsg)
      }
    })
    ws.on('message', (message) => {
      let msg = JSON.parse(message.toString())
      sendVaue.historyChat.push(msg)
      const webmsg = Buffer.from(JSON.stringify(sendVaue))
      // 发送消息给客户端
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(webmsg);
        }
      });
    })
    ws.on('close', () => {
      clients.delete(ws);
    })
  })
}

module.exports = webSocketChat