using WebChatApi.Common.Models;
using WebChatApi.Rooms;

namespace WebChatApi.Storage
{
    public class InMemoryChatStorage : IChatStorage
    {
        private readonly Dictionary<Guid, Room> _rooms = [];
        private int _idSequence = 1;
        private readonly Lock _lock = new();

        public Task<Room?> GetRoomAsync(Guid aggregateId, CancellationToken ct = default)
        {
            _rooms.TryGetValue(aggregateId, out var room);
            return Task.FromResult(room);
        }

        public Task<IReadOnlyCollection<Room>> GetAllRoomsAsync(CancellationToken ct = default)
            => Task.FromResult((IReadOnlyCollection<Room>)_rooms.Values.ToList());

        public Task AddRoomAsync(Room room, CancellationToken ct = default)
        {
            lock (_lock)
            {
                typeof(AggregateRoot)
                    .GetProperty(nameof(AggregateRoot.Id))!
                    .SetValue(room, _idSequence++);

                _rooms[room.AggregateId] = room;
            }

            return Task.CompletedTask;
        }

        public Task UpdateRoomAsync(Room room, CancellationToken ct = default)
        {
            lock (_lock)
            {
                if (!_rooms.ContainsKey(room.AggregateId))
                    throw new KeyNotFoundException($"Room {room.AggregateId} not found");

                _rooms[room.AggregateId] = room;
            }

            return Task.CompletedTask;
        }

        public Task DeleteRoomAsync(Guid aggregateId, CancellationToken ct = default)
        {
            lock (_lock)
            {
                _rooms.Remove(aggregateId);
            }

            return Task.CompletedTask;
        }
    }
}
