namespace WebChatApi.Bots.Stock
{
    public record StockQuote(
    string Symbol,
    DateOnly Date,
    TimeOnly Time,
    decimal Open,
    decimal High,
    decimal Low,
    decimal Close,
    long Volume);
}
