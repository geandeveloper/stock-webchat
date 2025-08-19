using System.Text.Json;
using WebChatApi.EventHandlers;
using WebChatApi.Rooms.SendMessage;

namespace WebChatApi
{
    public static class ChatApi
    {
        public static IEndpointRouteBuilder MapChatApi(this IEndpointRouteBuilder app)
        {
            app.MapGet("/rooms/{roomId}/join", async (
                        string roomId,
                        HttpContext context,
                        IEventBroadcaster broadcaster,
                        CancellationToken ct) =>
                    {
                        context.Response.Headers.Append("Content-Type", "text/event-stream");

                        var (reader, unsubscribe) = broadcaster.Subscribe();

                        try
                        {
                            await foreach (var (msgRoomId, data) in reader.ReadAllAsync(ct))
                            {
                                if (msgRoomId != roomId) continue;

                                var json = JsonSerializer.Serialize(data);

                                await context.Response.WriteAsync("event: messageReceived\n", ct);
                                await context.Response.WriteAsync($"data: {json}\n\n", ct);
                                await context.Response.Body.FlushAsync(ct);
                            }
                        }
                        finally
                        {
                            unsubscribe();
                        }
                    })
                    .WithName("JoinRoom");

            app.MapPost("/rooms/{roomId}/messages", async (
                  string roomId,
                  SendMessageCommand command,
                  SendMessageHandler handler,
                  CancellationToken cancellationToken) =>
              {
                  var result = await handler.HandleAsync(command with { RoomId = roomId, UserType = Rooms.FromType.User }, cancellationToken);

                  return Results.Ok(result);
              })
              .WithName("SendMessage");

            return app;
        }
    }
}
