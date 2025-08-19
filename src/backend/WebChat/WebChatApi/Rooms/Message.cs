namespace WebChatApi.Rooms
{
    public class Message(string text, Guid userId)
    {
        public Guid Id { get; } = Guid.NewGuid();
        public Guid UserId { get; } = userId;
        public string Text { get; } = text;
        public DateTime CreatedAt { get; } = DateTime.UtcNow;
    }
}
