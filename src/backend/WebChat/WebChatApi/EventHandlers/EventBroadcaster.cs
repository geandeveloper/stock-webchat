using System.Threading.Channels;

namespace WebChatApi.EventHandlers
{
    public class EventBroadcaster : IEventBroadcaster
    {
        private readonly List<Channel<(string RoomId, object Data)>> _subscribers = [];
        private readonly Lock _lock = new();

        public ChannelReader<(string RoomId, object Data)> Subscribe()
        {
            var channel = Channel.CreateUnbounded<(string, object)>();

            lock (_lock)
            {
                _subscribers.Add(channel);
            }

            return channel.Reader;
        }

        public ValueTask PublishAsync(string roomId, object data)
        {
            List<Channel<(string RoomId, object Data)>> subscribersCopy;

            lock (_lock)
            {
                subscribersCopy = [.. _subscribers];
            }

            foreach (var subscriber in subscribersCopy)
                _ = subscriber.Writer.TryWrite((roomId, data));

            return ValueTask.CompletedTask;
        }
    }
}
