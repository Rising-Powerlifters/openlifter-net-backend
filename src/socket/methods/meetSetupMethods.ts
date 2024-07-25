import { Formula, Lift, Sex } from '../../types/dataTypes'
import { MeetState } from '../../types/stateTypes'
import { RpcMethod } from '../../types/rpcTypes'
import meetRepository from "../../repositories/meetRepository";

export const enum MeetSetupMethod {
  SetMeetName = 'SET_MEET_NAME',
  SetFormula = 'SET_FORMULA',
  SetFederation = 'SET_FEDERATION',
  SetDivisions = 'SET_DIVISIONS',
  SetMeetDate = 'SET_MEET_DATE',
  SetLengthDays = 'SET_LENGTH_DAYS',
  SetPlatformsOnDays = 'SET_PLATFORM_COUNT',
  SetInKg = 'SET_IN_KG',
  SetWeightClasses = 'SET_WEIGHTCLASSES',
  SetBarAndCollarsWeightKg = 'SET_BAR_AND_COLLARS_WEIGHT_KG',
  SetPlateConfig = 'SET_PLATE_CONFIG',
  UpdateMeet = 'UPDATE_MEET'
}

export const meetSetupMethods: ReadonlyArray<RpcMethod> = [
  {
    name: MeetSetupMethod.SetMeetName,
    handler: (props: { name: string }) => {
      meetRepository.setMeetName(props.name)
    }
  },
  {
    name: MeetSetupMethod.SetFormula,
    handler: (props: { formula: Formula }) => {
      meetRepository.setFormula(props.formula)
    }
  },
  {
    name: MeetSetupMethod.SetFederation,
    handler: (props: { federation: string }) => {
      meetRepository.setFederation(props.federation)
    }
  },
  {
    name: MeetSetupMethod.SetDivisions,
    handler: (props: { divisions: ReadonlyArray<string> }) => {
      meetRepository.setDivisions(props.divisions)
    }
  },
  {
    name: MeetSetupMethod.SetMeetDate,
    handler: (props: { date: string }) => {
      meetRepository.setMeetDate(props.date)
    }
  },
  {
    name: MeetSetupMethod.SetLengthDays,
    handler: (props: { length: number }) => {
      meetRepository.setLengthDays(length)
    }
  },
  {
    name: MeetSetupMethod.SetPlatformsOnDays,
    handler: (props: { day: number; count: number }) => {
      meetRepository.setPlatformsOnDays(props.day, props.count)
    }
  },
  {
    name: MeetSetupMethod.SetInKg,
    handler: (props: { inKg: boolean }) => {
      meetRepository.setInKg(props.inKg)
    }
  },
  {
    name: MeetSetupMethod.SetWeightClasses,
    handler: (props: { sex: Sex; classesKg: ReadonlyArray<number> }) => {
      meetRepository.setWeightClasses(props.sex, props.classesKg)
    }
  },
  {
    name: MeetSetupMethod.SetBarAndCollarsWeightKg,
    handler: (props: { lift: Lift; weightKg: number }) => {
      meetRepository.setBarAndCollarsWeightKg(props.lift, props.weightKg)
    }
  },
  {
    name: MeetSetupMethod.SetPlateConfig,
    handler: (props: { weightKg: number; pairCount: number; color: string }) => {
      meetRepository.setPlateConfig(props.weightKg, props.pairCount, props.color)
    }
  },
  {
    name: MeetSetupMethod.UpdateMeet,
    handler: (props: { changes: Partial<MeetState> }) => {
      meetRepository.updateMeet(props.changes)
    }
  }
]
