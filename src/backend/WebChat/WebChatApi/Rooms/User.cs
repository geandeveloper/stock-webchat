namespace WebChatApi.Rooms
{
    public class User(string name, string avatar, FromType type)
    {
        public Guid Id { get; } = Guid.NewGuid();
        public string Name { get; } = name;
        public string Avatar { get; } = avatar;
        public FromType Type { get; } = type;
    }
}
