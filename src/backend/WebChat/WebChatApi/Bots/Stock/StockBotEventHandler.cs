using WebChatApi.EventHandlers;
using WebChatApi.Events.Room;
using WebChatApi.Rooms.SendMessage;

namespace WebChatApi.Bots.Stock
{
    public class StockBotEventHandler(
        IStooqApi stooqApi,
        SendMessageHandler sendMessageHander
        ) : IEventHandler<MessageSent>
    {
        public async Task HandleAsync(MessageSent @event, CancellationToken ct)
        {
            if (!@event.Message.StartsWith("/stock=", StringComparison.OrdinalIgnoreCase))
                return;

            var stockCode = @event.Message.Replace("/stock=", "").Trim();

            try
            {
                var content = await stooqApi.GetQuoteAsync(stockCode, ct: ct);
                var csv = await content.Content.ReadAsStringAsync(ct);

                var stockQuote = StooqParser.Parse(csv);

                var messageText = stockQuote is null
                    ? $"Sorry, I couldn't find any data for '{stockCode}'."
                    : $"{stockQuote.Symbol} quote is ${stockQuote.Close:F2} per share";

                var sendMessageCommand = new SendMessageCommand(
                    RoomId: @event.RoomId,
                    UserAvatar: string.Empty,
                    UserName: "Stock Bot",
                    UserType: Rooms.FromType.Bot,
                    MessageText: messageText
                );

                await sendMessageHander.HandleAsync(sendMessageCommand, ct);
            }
            catch
            {
                throw;
            }
        }
    }
}
