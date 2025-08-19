namespace WebChatApi.Common.Commands
{

    public interface IHandler<TCommand>
    {
        ValueTask<HandlerResult<object>> HandleAsync(TCommand command, CancellationToken ct);
    }

}
