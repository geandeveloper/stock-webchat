using WebChatApi.Common.Commands;
using WebChatApi.EventHandlers;
using WebChatApi.Events.Room;
using WebChatApi.Storage;

namespace WebChatApi.Rooms.SendMessage
{

    public class SendMessageHandler(
        IChatStorage storage,
        IEventPublisher publisher
        ) : IHandler<SendMessageCommand>
    {

        public async ValueTask<HandlerResult<object>> HandleAsync(SendMessageCommand command, CancellationToken ct)
        {

            var room = await storage.GetRoomAsync(Guid.Parse(command.RoomId), ct);

            if (room is null)
            {
                room = new Room(Guid.Parse(command.RoomId));
                await storage.AddRoomAsync(room, ct);
            }

            var user = new User(command.UserName, command.UserAvatar, command.UserType);
            var message = new Message(command.MessageText, user.Id);

            room.AddMessage(user, message);

            await storage.UpdateRoomAsync(room, ct);

            var @event = new MessageSent(
                room.AggregateId.ToString(),
                user.Id.ToString(),
                user.Name,
                user.Avatar,
                message.Id.ToString(),
                message.Text,
                command.UserType
                );

            await publisher.PublishAsync(@event);

            return await From(@event)
                .MapAsync((m) => new
                {
                    Event = m
                });

        }
    }
}
