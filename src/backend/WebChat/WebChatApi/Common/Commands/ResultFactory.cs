namespace WebChatApi.Common.Commands
{
    public static class ResultFactory
    {
        public static HandlerResult<T> From<T>(T value) =>
            new(HandlerState.Success, value);

        public static HandlerResult<(T1, T2)> From<T1, T2>(T1 v1, T2 v2) =>
            new(HandlerState.Success, (v1, v2));

        public static HandlerResult<(T1, T2, T3)> From<T1, T2, T3>(T1 v1, T2 v2, T3 v3) =>
            new(HandlerState.Success, (v1, v2, v3));
    }
}
