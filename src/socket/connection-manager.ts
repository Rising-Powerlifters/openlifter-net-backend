import { WebSocket } from 'ws'

export class ConnectionManager {
  private activeConnections: WebSocket[] = []

  public connect(ws: WebSocket) {
    this.activeConnections.push(ws)
  }

  public disconnect(ws: WebSocket) {
    this.activeConnections = this.activeConnections.filter((connection) => connection !== ws)
  }

  public static sendPersonalMessage(ws: WebSocket, message: string) {
    ws.send(message)
  }

  public broadcast(message: string) {
    this.activeConnections.forEach((connection) => connection.send(message))
  }
}
