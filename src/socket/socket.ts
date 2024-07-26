import express, {Request} from 'express'
import {RawData, WebSocket} from 'ws'
import {ConnectionManager} from './connection-manager'
import {JSONRPCClient, JSONRPCRequest, JSONRPCServer, JSONRPCServerAndClient} from 'json-rpc-2.0'
import {WebSocketError} from './models/errors'
import {RpcMethod} from '../types/rpcTypes'
import {meetSetupMethods} from './methods/meetSetupMethods'
import {liftingMethods} from './methods/liftingMethods'
import {registrationMethods} from './methods/registrationMethods'
import {globalMethods} from "./methods/globalMethods";
import {StateManager} from "../state/stateManager";
import {GlobalState} from "../types/stateTypes";

const app = express.Router()
const connectionManager = new ConnectionManager()
const stateManager = new StateManager()
const rpc = new JSONRPCServerAndClient(
    new JSONRPCServer(),
    new JSONRPCClient((request) => {
        connectionManager.broadcast(JSON.stringify(request))
    })
)

export function addMethods(methods: ReadonlyArray<RpcMethod>) {
    methods.forEach((method) => {
        rpc.addMethod(method.name, method.handler)
    })
}

addMethods(meetSetupMethods)
addMethods(liftingMethods)
addMethods(registrationMethods)
addMethods(globalMethods)

rpc.addMethod('GET_STATE', () => {
    const state = stateManager.get()
    return {state: state}
})

stateManager.registerCallback((state: GlobalState) => {
    rpc.client.request('STATE_UPDATE', {state: state})
})

app.ws('/socket', (ws: WebSocket, req: Request) => {
    connectionManager.connect(ws)

    ws.on('message', (message: RawData) => {
        try {
            const request: JSONRPCRequest = JSON.parse(message.toString())
            rpc.receiveAndSend(request)
        } catch (e: unknown) {
            const error: WebSocketError = {
                type: 'ERROR',
                message: e.toString()
            }
            ConnectionManager.sendPersonalMessage(ws, JSON.stringify(error))
        }
    })

    ws.on('close', () => {
        connectionManager.disconnect(ws)
    })
})

export default app
