using WebChatApi.Rooms;

namespace WebChatApi.Events.Room
{

    public record MessageSent(
        string RoomId,
        string UserId,
        string UserName,
        string UserAvatar,
        string MessageId,
        string Message,
        FromType FromType 
        )
    {
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
