namespace WebChatApi.EventHandlers
{
    using System.Threading.Channels;
    using System.Threading;

    public class EventBroadcaster : IEventBroadcaster
    {
        private readonly List<Channel<(string RoomId, object Data)>> _subscribers = [];
        private readonly Lock _lock = new();

        public (ChannelReader<(string roomId, object data)> reader, Action unsubscribe) Subscribe()
        {
            var channel = Channel.CreateUnbounded<(string, object)>();

            using (_lock.EnterScope())
                _subscribers.Add(channel);

            void Unsubscribe()
            {
                using (_lock.EnterScope())
                {
                    _subscribers.Remove(channel);
                    channel.Writer.TryComplete();
                }
            }

            return (channel.Reader, Unsubscribe);
        }

        public ValueTask PublishAsync(string roomId, object data)
        {
            List<Channel<(string RoomId, object Data)>> subscribersCopy;

            using (_lock.EnterScope())
                subscribersCopy = [.. _subscribers];

            foreach (var subscriber in subscribersCopy)
                subscriber.Writer.TryWrite((roomId, data));

            return ValueTask.CompletedTask;
        }
    }

}
