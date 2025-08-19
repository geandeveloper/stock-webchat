namespace WebChatApi.EventHandlers
{
    public record RabbitMqEventHandlerSettings(string HostName, string UserName, string Password, string Queue);
}
