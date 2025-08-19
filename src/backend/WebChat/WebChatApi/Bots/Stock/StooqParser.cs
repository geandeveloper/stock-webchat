namespace WebChatApi.Bots.Stock
{
    public static class StooqParser
    {
        public static StockQuote? Parse(string csv)
        {
            return csv
            .Split('\n', StringSplitOptions.RemoveEmptyEntries)
            .Skip(1)
            .Select(line => line.Split(','))
            .Where(data => data.Length >= 8 && data[6] != "N/D")
            .Select(data => new StockQuote(
                Symbol: data[0],
                Date: DateOnly.Parse(data[1], System.Globalization.CultureInfo.InvariantCulture),
                Time: TimeOnly.Parse(data[2], System.Globalization.CultureInfo.InvariantCulture),
                Open: decimal.Parse(data[3], System.Globalization.CultureInfo.InvariantCulture),
                High: decimal.Parse(data[4], System.Globalization.CultureInfo.InvariantCulture),
                Low: decimal.Parse(data[5], System.Globalization.CultureInfo.InvariantCulture),
                Close: decimal.Parse(data[6], System.Globalization.CultureInfo.InvariantCulture),
                Volume: long.Parse(data[7], System.Globalization.CultureInfo.InvariantCulture)
            )).FirstOrDefault();
        }
    }
}
