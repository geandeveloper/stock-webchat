namespace WebChatApi.EventHandlers
{
    public interface IEventPublisher
    {
        Task PublishAsync<TEvent>(TEvent message);
    }
}
