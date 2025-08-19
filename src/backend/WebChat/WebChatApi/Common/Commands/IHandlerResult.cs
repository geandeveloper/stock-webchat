namespace WebChatApi.Common.Commands
{
    public interface IHandlerResult
    {
        public HandlerState State { get; }
        public object? Data { get; }
    }

}
