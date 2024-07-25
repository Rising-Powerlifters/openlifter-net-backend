import {GlobalState, LiftingState, MeetState, RegistrationState, StateCallbackFunction} from '../types/stateTypes'
import * as fs from 'node:fs'

export class StateManager {
  public static stateFilePath = './state.json'

  private static instance: StateManager | undefined

  private state: GlobalState
  private callbacks: StateCallbackFunction[] = []


  public constructor() {
    if (StateManager.instance) {
      return StateManager.instance
    }
    StateManager.instance = this
  }

  public get(): GlobalState {
    return this.state
  }

  public saveState(newState: GlobalState) {
    this.state = newState
    this.save()
    this.executeCallbacks()
  }

  public saveMeetState(newMeetState: MeetState) {
    const newState = { ...this.state, meet: newMeetState }
    this.saveState(newState)
  }

  public saveLiftingState(newLiftingState: LiftingState) {
    const newState = { ...this.state, lifting: newLiftingState }
    this.saveState(newState)
  }

  public saveRegistrationState(newRegistrationState: RegistrationState) {
    const newState = { ...this.state, registration: newRegistrationState }
    this.saveState(newState)
  }

  public registerCallback(callbackFunction: StateCallbackFunction) {
    this.callbacks.push(callbackFunction)
  }

  private executeCallbacks() {
    this.callbacks.forEach((callback) => callback(this.state))
  }

  private save() {
    fs.writeFile(StateManager.stateFilePath, JSON.stringify(this.state), (err) => {
      if (err) {
        console.error(err)
      } else {
        console.log('State saved...')
      }
    })
  }
}
