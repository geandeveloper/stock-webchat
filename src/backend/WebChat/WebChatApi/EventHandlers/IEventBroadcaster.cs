using System.Threading.Channels;

namespace WebChatApi.EventHandlers
{
    public interface IEventBroadcaster
    {
        ChannelReader<(string RoomId, object Data)> Subscribe();
        ValueTask PublishAsync(string roomId, object data);
    }
}
