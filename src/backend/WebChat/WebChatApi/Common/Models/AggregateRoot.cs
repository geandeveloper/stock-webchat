namespace WebChatApi.Common.Models
{
    public abstract class AggregateRoot(Guid aggregateId)
    {
        public int Id { get; private set; }
        public Guid AggregateId { get; private set; } = aggregateId;
    }
}
