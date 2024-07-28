// This file is part of OpenLifter, simple Powerlifting meet software.
// Copyright (C) 2019 The OpenPowerlifting Project.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { Entry, Flight, Formula, Lift, Plate, AgeCoefficients } from './dataTypes'

export type MeetState = {
  // Sanction Information.
  readonly name: string
  readonly country: string
  readonly state: string
  readonly city: string
  readonly federation: string
  readonly date: string
  readonly lengthDays: number
  readonly platformsOnDays: ReadonlyArray<number>
  readonly ageCoefficients: AgeCoefficients

  // Competition Rules.
  readonly divisions: ReadonlyArray<string>
  readonly weightClassesKgMen: ReadonlyArray<number>
  readonly weightClassesKgWomen: ReadonlyArray<number>
  readonly weightClassesKgMx: ReadonlyArray<number>
  readonly formula: Formula
  readonly combineSleevesAndWraps: boolean
  readonly combineSingleAndMulti: boolean
  readonly allow4thAttempts: boolean

  // Weights and Loading Setup.
  readonly inKg: boolean
  readonly squatBarAndCollarsWeightKg: number
  readonly benchBarAndCollarsWeightKg: number
  readonly deadliftBarAndCollarsWeightKg: number
  readonly plates: ReadonlyArray<Readonly<Plate>>
  readonly showAlternateUnits: boolean
}

export type RegistrationState = {
  readonly nextEntryId: number
  readonly entries: ReadonlyArray<Readonly<Entry>>
  readonly lookup: {
    readonly [id: number]: number
  }
}

export type LiftingState = {
  readonly day: number
  readonly platform: number
  readonly flight: Flight
  readonly lift: Lift
  readonly overrideAttempt: number | null
  readonly overrideEntryId: number | null
}

export type GlobalState = {
  readonly meet: MeetState
  readonly registration: RegistrationState
  readonly lifting: LiftingState
}

export type StateCallbackFunction = (state: GlobalState) => void
