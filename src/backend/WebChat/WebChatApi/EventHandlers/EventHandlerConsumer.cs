using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using WebChatApi.Events.Room;

namespace WebChatApi.EventHandlers
{
    public class EventHandlerConsumer(
        ILogger<EventHandlerConsumer> logger,
        RabbitMqEventHandlerSettings settings,
        IEventBroadcaster broadcaster,
        IEnumerable<IEventHandler<MessageSent>> handlers
        ) : BackgroundService
    {
        private readonly ILogger<EventHandlerConsumer> _logger = logger;
        private readonly RabbitMqEventHandlerSettings _settings = settings;
        private readonly IEventBroadcaster _broadcaster = broadcaster;
        private readonly IReadOnlyList<IEventHandler<MessageSent>> _handlers = handlers.ToList();


        private IConnection? _connection;
        private IChannel? _channel;

        public override async Task StartAsync(CancellationToken cancellationToken)
        {
            var factory = new ConnectionFactory
            {
                UserName = _settings.UserName,
                Password = _settings.Password,
                HostName = _settings.HostName
            };

            _connection = await factory.CreateConnectionAsync(cancellationToken);
            _channel = await _connection.CreateChannelAsync(cancellationToken: cancellationToken);

            await _channel.QueueDeclareAsync(queue: _settings.Queue, durable: false, exclusive: false, autoDelete: false, arguments: null, cancellationToken: cancellationToken);

            _logger.LogInformation(" [*] Waiting for messages...");

            await base.StartAsync(cancellationToken);
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var consumer = new AsyncEventingBasicConsumer(_channel!);

            consumer.ReceivedAsync += async (model, ea) =>
            {
                var message = Encoding.UTF8.GetString(ea.Body.ToArray());

                _logger.LogInformation(" [x] Received {Message}", message);

                var @event = JsonSerializer.Deserialize<MessageSent>(message)!;

                await _broadcaster.PublishAsync(@event.RoomId, @event);

                foreach (var eventHandlers in _handlers)
                    await eventHandlers.HandleAsync(@event, stoppingToken);
            };

            _channel!.BasicConsumeAsync(queue: _settings.Queue, autoAck: true, consumer: consumer, stoppingToken);

            return Task.CompletedTask;
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            await _channel!.CloseAsync(cancellationToken: cancellationToken);
            await _connection!.CloseAsync(cancellationToken: cancellationToken);

            _logger.LogInformation(" [x] Connection closed.");
            await base.StopAsync(cancellationToken);
        }
    }
}
