using WebChatApi.Rooms;

namespace WebChatApi.Storage
{
    public interface IChatStorage
    {
        Task<Room?> GetRoomAsync(Guid aggregateId, CancellationToken ct = default);
        Task<IReadOnlyCollection<Room>> GetAllRoomsAsync(CancellationToken ct = default);
        Task AddRoomAsync(Room room, CancellationToken ct = default);
        Task UpdateRoomAsync(Room room, CancellationToken ct = default);
        Task DeleteRoomAsync(Guid aggregateId, CancellationToken ct = default);
    }
}
