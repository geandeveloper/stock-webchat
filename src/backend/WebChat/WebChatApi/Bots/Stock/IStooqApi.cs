using Refit;

namespace WebChatApi.Bots.Stock
{
    public interface IStooqApi
    {
        [Get("/q/l/")]
        Task<HttpResponseMessage> GetQuoteAsync(
            [AliasAs("s")] string symbol,
            [AliasAs("f")] string fields = "sd2t2ohlcv",
            [AliasAs("h")] string header = "on",
            [AliasAs("e")] string format = "csv",
            CancellationToken ct = default
        );
    }
}
