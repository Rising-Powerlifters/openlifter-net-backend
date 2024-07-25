export type RpcMethodHandler = (props: any) => void
export type RpcMethodName = string
export type RpcMethod = {
  name: RpcMethodName
  handler: RpcMethodHandler
}
