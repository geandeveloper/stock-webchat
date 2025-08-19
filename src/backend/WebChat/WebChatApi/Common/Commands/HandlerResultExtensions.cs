namespace WebChatApi.Common.Commands
{
    public static class HandlerResultExtensions
    {
        public static ValueTask<HandlerResult<object>> MapAsync<TSource>(
            this HandlerResult<TSource> result,
            Func<TSource, object> mapper)
        {
            if (result.IsFail || result.Value is null)
                return new HandlerResult<object>(HandlerState.Fail, default).ToValueTask();

            return new HandlerResult<object>(HandlerState.Success, mapper(result.Value)).ToValueTask();
        }

        public static ValueTask<HandlerResult<object>> ToValueTask<T>(
            this HandlerResult<T> result) => ValueTask.FromResult(new HandlerResult<object>(result.State, result.Value!));
    }
}
