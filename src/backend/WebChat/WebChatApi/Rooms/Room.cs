using WebChatApi.Common.Models;

namespace WebChatApi.Rooms
{
    public class Room(Guid roomId) : AggregateRoot(roomId)
    {
        public string Title { get; private set; } = string.Empty;

        private readonly List<Message> _messages = [];
        private readonly List<User> _users = [];

        public IReadOnlyCollection<Message> Messages => _messages.AsReadOnly();
        public IReadOnlyCollection<User> Users => _users.AsReadOnly();


        public void AddMessage(User user, Message message)
        {
            _users.Add(user);
            _messages.Add(message);
        }
    }
}
