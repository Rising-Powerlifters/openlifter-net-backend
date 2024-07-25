import { RpcMethod } from '../../types/rpcTypes'
import { Entry } from '../../types/dataTypes'
import registrationRepository from "../../repositories/registrationRepository";

export const enum RegistrationMethod {
  NewRegistration = 'NEW_REGISTRATION',
  DeleteRegistration = 'DELETE_REGISTRATION',
  UpdateRegistration = 'UPDATE_REGISTRATION',
  MergePlatform = 'MERGE_PLATFORM',
  AssignLotNumbers = 'ASSIGN_LOT_NUMBERS'
}

export const registrationMethods: ReadonlyArray<RpcMethod> = [
  {
    name: RegistrationMethod.NewRegistration,
    handler: (props: { overwriteDefaults: Partial<Entry> }) => {
      registrationRepository.newRegistration(props.overwriteDefaults)
    }
  },
  {
    name: RegistrationMethod.DeleteRegistration,
    handler: (props: { entryId: number }) => {
      registrationRepository.deleteRegistration(props.entryId)
    }
  },
  {
    name: RegistrationMethod.UpdateRegistration,
    handler: (props: { entryId: number; changes: Partial<Entry> }) => {
      registrationRepository.updateRegistration(props.entryId, props.changes)
    }
  },
  {
    name: RegistrationMethod.MergePlatform,
    handler: (props: { day: number; platform: number; platformEntries: Array<Entry> }) => {}
  },
  {
    name: RegistrationMethod.AssignLotNumbers,
    handler: (props: { lotNumbers: number[] }) => {}
  }
]
