import {RpcMethod} from "../../types/rpcTypes";
import {GlobalState} from "../../types/stateTypes";
import meetRepository from "../../repositories/meetRepository";
import liftingRepository from "../../repositories/liftingRepository";
import registrationRepository from "../../repositories/registrationRepository";

export const enum GlobalMethod {
    OverwriteStore = 'OVERWRITE_STORE'
}

export const globalMethods: ReadonlyArray<RpcMethod> = [
    {
        name: GlobalMethod.OverwriteStore,
        handler: (props: {store: GlobalState}) => {
            meetRepository.overwriteStore(props.store.meet)
            liftingRepository.overwriteStore(props.store.lifting)
            registrationRepository.overwriteStore(props.store.registration)
        }
    }
]