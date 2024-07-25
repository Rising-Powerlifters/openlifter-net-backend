import { StateManager } from '../state/stateManager'
import { Formula, Lift, Plate, Sex } from '../types/dataTypes'
import { PlateColors } from '../constants/plateColors'
import { lbs2kg } from '../logic/units'
import { MeetState } from '../types/stateTypes'
import { localDateToIso8601 } from '../logic/date'

const stateManager = new StateManager()

const defaultPlatformsOnDay = 1

const defaultBarAndCollarsWeightKg = 25 // Assuming metal 2.5kg collars.
const defaultBarAndCollarsWeightLbs = 45 // Assuming plastic collars.

// Default kg plates, allowing for increments of 0.5kg.
const defaultPlatesKg: ReadonlyArray<Plate> = [
  { weightKg: 50, pairCount: 0, color: PlateColors.PLATE_DEFAULT_GREEN },
  { weightKg: 25, pairCount: 8, color: PlateColors.PLATE_DEFAULT_RED },
  { weightKg: 20, pairCount: 1, color: PlateColors.PLATE_DEFAULT_BLUE },
  { weightKg: 15, pairCount: 1, color: PlateColors.PLATE_DEFAULT_YELLOW },
  { weightKg: 10, pairCount: 1, color: PlateColors.PLATE_DEFAULT_GREEN },
  { weightKg: 5, pairCount: 1, color: PlateColors.PLATE_DEFAULT_BLACK },
  { weightKg: 2.5, pairCount: 1, color: PlateColors.PLATE_DEFAULT_BLACK },
  { weightKg: 2, pairCount: 0, color: PlateColors.PLATE_DEFAULT_BLUE },
  { weightKg: 1.5, pairCount: 0, color: PlateColors.PLATE_DEFAULT_YELLOW },
  { weightKg: 1.25, pairCount: 1, color: PlateColors.PLATE_DEFAULT_BLACK },
  { weightKg: 1, pairCount: 1, color: PlateColors.PLATE_DEFAULT_BLUE },
  { weightKg: 0.75, pairCount: 1, color: PlateColors.PLATE_DEFAULT_RED },
  { weightKg: 0.5, pairCount: 1, color: PlateColors.PLATE_DEFAULT_GREEN },
  { weightKg: 0.25, pairCount: 1, color: PlateColors.PLATE_DEFAULT_BLUE }
]

// Default lbs plates, allowing for increments of 1lb.
const defaultPlatesLbs: ReadonlyArray<Plate> = [
  { weightKg: lbs2kg(100), pairCount: 0, color: PlateColors.PLATE_DEFAULT_GREEN },
  { weightKg: lbs2kg(55), pairCount: 0, color: PlateColors.PLATE_DEFAULT_RED },
  { weightKg: lbs2kg(45), pairCount: 8, color: PlateColors.PLATE_DEFAULT_GRAY },
  { weightKg: lbs2kg(35), pairCount: 0, color: PlateColors.PLATE_DEFAULT_GRAY },
  { weightKg: lbs2kg(25), pairCount: 1, color: PlateColors.PLATE_DEFAULT_GRAY },
  { weightKg: lbs2kg(10), pairCount: 2, color: PlateColors.PLATE_DEFAULT_GRAY },
  { weightKg: lbs2kg(5), pairCount: 1, color: PlateColors.PLATE_DEFAULT_GRAY },
  { weightKg: lbs2kg(2.5), pairCount: 1, color: PlateColors.PLATE_DEFAULT_GRAY },
  { weightKg: lbs2kg(1.25), pairCount: 1, color: PlateColors.PLATE_DEFAULT_GRAY },
  { weightKg: lbs2kg(0.5), pairCount: 2, color: PlateColors.PLATE_DEFAULT_GRAY }
]

const initialState: MeetState = {
    // Sanction information.
    name: '',
        country: '',
        state: '',
        city: '',
        federation: '',
        date: localDateToIso8601(new Date()),
        lengthDays: 1,
        platformsOnDays: [defaultPlatformsOnDay],

        // Competition Rules.
        divisions: [],
        weightClassesKgMen: [],
        weightClassesKgWomen: [],
        weightClassesKgMx: [],
        formula: 'Dots',
        ageCoefficients: 'None',
        combineSleevesAndWraps: false,
        combineSingleAndMulti: false,
        allow4thAttempts: false,

        // Weights and Loading Setup.
        inKg: true,
        showAlternateUnits: false,
        squatBarAndCollarsWeightKg: defaultBarAndCollarsWeightKg,
        benchBarAndCollarsWeightKg: defaultBarAndCollarsWeightKg,
        deadliftBarAndCollarsWeightKg: defaultBarAndCollarsWeightKg,
        plates: defaultPlatesKg
}

export default {
  initialState: initialState,
  setMeetName: (name: string) => {
    const newMeetState = { ...stateManager.get().meet, name: name }
    stateManager.saveMeetState(newMeetState)
  },
  setFormula: (formula: Formula) => {
    const newMeetState = { ...stateManager.get().meet, formula: formula }
    stateManager.saveMeetState(newMeetState)
  },
  setFederation: (federation: string) => {
    const newMeetState = { ...stateManager.get().meet, federation: federation }
    stateManager.saveMeetState(newMeetState)
  },
  setDivisions: (divisions: ReadonlyArray<string>) => {
    const newMeetState = { ...stateManager.get().meet, divisions: divisions }
    stateManager.saveMeetState(newMeetState)
  },
  setMeetDate: (date: string) => {
    const newMeetState = { ...stateManager.get().meet, date: date }
    stateManager.saveMeetState(newMeetState)
  },
  setLengthDays: (length: number) => {
    const state = stateManager.get().meet
    let newMeetState: MeetState

    if (length >= state.platformsOnDays.length) {
      const diff = length - state.platformsOnDays.length

      const newPlatformsOnDays: Array<number> = state.platformsOnDays.slice()
      for (let i = 0; i < diff; i++) {
        newPlatformsOnDays.push(defaultPlatformsOnDay)
      }

      newMeetState = { ...state, lengthDays: length, platformsOnDays: newPlatformsOnDays }
    } else {
      newMeetState = { ...state, lengthDays: length }
    }
    stateManager.saveMeetState(newMeetState)
  },
  setPlatformsOnDays: (day: number, count: number) => {
    const state = stateManager.get().meet

    const newPlatformsOnDays: Array<number> = state.platformsOnDays.slice()
    newPlatformsOnDays[day - 1] = count
    const newMeetState = { ...state, platformsOnDays: newPlatformsOnDays }
    stateManager.saveMeetState(newMeetState)
  },
  setInKg: (inKg: boolean) => {
    const state = stateManager.get().meet
    const defaultPlates = inKg ? defaultPlatesKg : defaultPlatesLbs
    const defaultBar = inKg ? defaultBarAndCollarsWeightKg : lbs2kg(defaultBarAndCollarsWeightLbs)
    const newMeetState = {
      ...state,
      inKg: inKg,
      plates: defaultPlates,
      squatBarAndCollarsWeightKg: defaultBar,
      benchBarAndCollarsWeightKg: defaultBar,
      deadliftBarAndCollarsWeightKg: defaultBar
    }
    stateManager.saveMeetState(newMeetState)
  },
  setWeightClasses: (sex: Sex, classesKg: ReadonlyArray<number>) => {
    const state = stateManager.get().meet
    let newMeetState: MeetState
    switch (sex) {
      case 'M':
        newMeetState = { ...state, weightClassesKgMen: classesKg }
        break
      case 'F':
        newMeetState = { ...state, weightClassesKgWomen: classesKg }
        break
      case 'Mx':
        newMeetState = { ...state, weightClassesKgMx: classesKg }
        break
      default:
        return
    }
    stateManager.saveMeetState(newMeetState)
  },
  setBarAndCollarsWeightKg: (lift: Lift, weightKg: number) => {
    const state = stateManager.get().meet
    let newMeetState: MeetState
    switch (lift) {
      case 'S':
        newMeetState = { ...state, squatBarAndCollarsWeightKg: weightKg }
        break
      case 'B':
        newMeetState = { ...state, benchBarAndCollarsWeightKg: weightKg }
        break
      case 'D':
        newMeetState = { ...state, deadliftBarAndCollarsWeightKg: weightKg }
        break
      default:
        return
    }
    stateManager.saveMeetState(newMeetState)
  },
  setPlateConfig: (weightKg: number, pairCount: number, color: string) => {
    const state = stateManager.get().meet

    // Find the index of the object in the platesOnSide array by comparing weights.
    const index = state.plates.findIndex((p) => p.weightKg === weightKg)

    // Clone the array.
    const newPlates: Array<Plate> = state.plates.slice()

    // Replace with a new object in the new array.
    newPlates[index] = { weightKg, pairCount, color }

    const newMeetState = { ...state, plates: newPlates }
    stateManager.saveMeetState(newMeetState)
  },
  updateMeet: (changes: Partial<MeetState>) => {
    const state = stateManager.get().meet

    // Make a new MeetState with just the changes overwritten.
    const newState = Object.assign({}, state)
    const newMeetState = Object.assign(newState, changes)
    stateManager.saveMeetState(newMeetState)
  },
  overwriteStore: (store: MeetState) => {
    stateManager.saveMeetState(store)
  }
}