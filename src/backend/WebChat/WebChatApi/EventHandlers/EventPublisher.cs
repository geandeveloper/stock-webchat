using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

namespace WebChatApi.EventHandlers
{
    public class EventPublisher : IEventPublisher, IAsyncDisposable
    {
        private readonly RabbitMqEventHandlerSettings _settings;
        private IConnection? _connection;
        private IChannel? _channel;

        public EventPublisher(RabbitMqEventHandlerSettings settings)
        {
            _settings = settings;
        }

        public async Task InitializeAsync(CancellationToken cancellationToken = default)
        {
            var factory = new ConnectionFactory
            {
                UserName = _settings.UserName,
                Password = _settings.Password,
                HostName = _settings.HostName
            };

            _connection = await factory.CreateConnectionAsync(cancellationToken);
            _channel = await _connection.CreateChannelAsync(cancellationToken: cancellationToken);

            await _channel.QueueDeclareAsync(
                queue: _settings.Queue,
                durable: false,
                exclusive: false,
                autoDelete: false,
                arguments: null,
                cancellationToken: cancellationToken
            );
        }

        public async Task PublishAsync<TEvent>(TEvent message)
        {
            if (_channel == null)
                throw new InvalidOperationException("Publisher is not initialized. Call InitializeAsync first.");

            var json = JsonSerializer.Serialize(message);
            var body = Encoding.UTF8.GetBytes(json);

            await _channel.BasicPublishAsync(
                exchange: "",
                routingKey: _settings.Queue,
                body: body,
                cancellationToken: CancellationToken.None
            );
        }

        public async ValueTask DisposeAsync()
        {
            if (_channel != null)
                await _channel.CloseAsync();

            if (_connection != null)
                await _connection.CloseAsync();
        }
    }
}
