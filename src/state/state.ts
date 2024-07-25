import { GlobalState, MeetState } from '../types/stateTypes'
import fs from 'node:fs'
import { StateManager } from './stateManager'
import meetRepository from "../repositories/meetRepository";
import liftingRepository from "../repositories/liftingRepository";
import registrationRepository from "../repositories/registrationRepository";

export function initializeState() {
  let state = readStateFromFile()
  if (!state) {
    state = {
      meet: meetRepository.initialState,
      lifting: liftingRepository.initalState,
      registration: registrationRepository.initialState
    }
  }
  const stateManager = new StateManager()
  stateManager.saveState(state)
}

function readStateFromFile(): GlobalState | undefined {
  try {
    const data = fs.readFileSync(StateManager.stateFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error(err)
  }
}
