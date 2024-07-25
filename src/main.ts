import express from 'express'
import expressWs from 'express-ws'

const app = expressWs(express()).app
/**
 * Workaround for expressWs:
 * JavaScript imports are resolved before executing the file.
 * Since the router is imported before expressWs has
 * upgraded the express app, this leads to an error.
 * This is why we need to import websocket routes
 * after upgrading the express app.
 */
import socket from './socket/socket'
import { initializeState } from './state/state'

initializeState()
app.use(socket)

app.listen(8080)
