namespace WebChatApi.Common.Commands
{
    public readonly record struct HandlerResult<T>(HandlerState State, T? Value)
    {
        public bool IsSuccess => State == HandlerState.Success;
        public bool IsFail => State != HandlerState.Success;
    }
}
