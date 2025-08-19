namespace WebChatApi.Rooms.SendMessage
{
    public record SendMessageCommand(
            string RoomId,
            string UserAvatar,
            string UserName,
            FromType UserType,
            string MessageText
        );
}
