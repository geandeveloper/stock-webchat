using System.Threading.Channels;

namespace WebChatApi.EventHandlers
{
    public interface IEventBroadcaster
    {
        (ChannelReader<(string roomId, object data)> reader, Action unsubscribe) Subscribe();
        ValueTask PublishAsync(string roomId, object data);
    }
}
