namespace WebChatApi.EventHandlers
{
    public interface IEventHandler<TEvent> 
    {
        Task HandleAsync(TEvent @event, CancellationToken ct);
    }
}
