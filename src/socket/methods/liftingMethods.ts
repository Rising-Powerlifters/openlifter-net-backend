import {RpcMethod} from '../../types/rpcTypes'
import {Flight, Lift} from '../../types/dataTypes'
import {LiftingState} from '../../types/stateTypes'
import liftingRepository from "../../repositories/liftingRepository";
import registrationRepository from "../../repositories/registrationRepository";

export const enum LiftingMethod {
  EnterAttempt = 'ENTER_ATTEMPT',
  MarkLift = 'MARK_LIFT',
  SetLiftingGroup = 'SET_LIFTING_GROUP',
  OverrideAttempt = 'OVERRIDE_ATTEMPT',
  OverrideEntryId = 'OVERRIDE_ENTRY_ID',
  SetTableInfo = 'SET_TABLE_INFO'
}

export const liftingMethods: ReadonlyArray<RpcMethod> = [
  {
    name: LiftingMethod.EnterAttempt,
    handler: (props: {
      entryId: number
      lift: Lift
      attemptOneIndexed: number
      weightKg: number
    }) => {
      registrationRepository.enterAttempt(props.entryId, props.lift, props.attemptOneIndexed, props.weightKg)
    }
  },
  {
    name: LiftingMethod.MarkLift,
    handler: (props: {
      entryId: number
      lift: Lift
      attemptOneIndexed: number
      success: boolean
    }) => {
      liftingRepository.markLift()
      registrationRepository.markLift(props.entryId, props.lift, props.attemptOneIndexed, props.success)
    }
  },
  {
    name: LiftingMethod.SetLiftingGroup,
    handler: (props: { day: number; platform: number; flight: Flight; lift: Lift }) => {
      liftingRepository.setLiftingGroup(props.day, props.platform, props.flight, props.lift)
    }
  },
  {
    name: LiftingMethod.OverrideAttempt,
    handler: (props: { attempt: number }) => {
      liftingRepository.overrideAttempt(props.attempt)
    }
  },
  {
    name: LiftingMethod.OverrideEntryId,
    handler: (props: { entryId: number }) => {
      liftingRepository.overrideEntryId(props.entryId)
    }
  },
  {
    name: LiftingMethod.SetTableInfo,
    handler: (props: { obj: Partial<LiftingState> }) => {
      liftingRepository.setTableInfo(props.obj)
    }
  }
]
