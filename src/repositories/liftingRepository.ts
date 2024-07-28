import { StateManager } from '../state/stateManager'
import {GlobalState, LiftingState} from '../types/stateTypes'
import {Flight, Lift} from '../types/dataTypes'

const stateManager = new StateManager()

const initialState: LiftingState = {
  // Specifies the initial settings for the control widgets on the lifting page.
  // The intention is that the score table sets these manually.
  day: 1,
  platform: 1,
  flight: 'A',
  lift: 'S',

  // These properties are normally calculated, but exist here as a mechanism
  // for a one-shot override of the normal logic. After being handled,
  // they are unset.
  overrideAttempt: null, // Allows selecting an attempt, even if it's completed.
  overrideEntryId: null, // Allows selecting a lifter, even if they've already gone.
}

export default {
  initalState: initialState,
  markLift: () => {
    const state = stateManager.get().lifting
    const newLiftingState = {...state, overrideAttempt: null, overrideEntryId: null}
    stateManager.saveLiftingState(newLiftingState)
  },
  setLiftingGroup: (day: number, platform: number, flight: Flight, lift: Lift) => {
    const state = stateManager.get().lifting
    const newLiftingState = {
      ...state,
      day: day,
      platform: platform,
      flight: flight,
      lift: lift,
      overrideAttempt: null,
      overrideEntryId: null
    }
    stateManager.saveLiftingState(newLiftingState)
  },
  overrideAttempt: (attempt: number) => {
    const state = stateManager.get().lifting
    const newLiftingState = {...state, overrideAttempt: attempt}
    stateManager.saveLiftingState(newLiftingState)
  },
  overrideEntryId: (entryId: number) => {
    const state = stateManager.get().lifting
    const newLiftingState = {...state, overrideEntryId: entryId}
    stateManager.saveLiftingState(newLiftingState)
  },
  overwriteStore: (store: LiftingState) => {
    stateManager.saveLiftingState(store)
  },
  setTableInfo: (changes: Partial<LiftingState>) => {
    const state = stateManager.get().lifting

    const combined = Object.assign({}, state);
    Object.assign(combined, changes);

    // Source from this new combined object, with fields unrelated to customization
    // deferring to the original state.
    //
    // So that means:
    //  - Fields unrelated to customization will be the same as in 'state'.
    //  - Customization fields will be from 'combined', which includes all fields
    //    and allowed the 'changes' object to overwrite any of them.
    const newLiftingState = {
      ...combined,

      day: state.day,
      platform: state.platform,
      flight: state.flight,
      lift: state.lift,

      overrideAttempt: state.overrideAttempt,
      overrideEntryId: state.overrideEntryId,
    }
    stateManager.saveLiftingState(newLiftingState)
  }
}
