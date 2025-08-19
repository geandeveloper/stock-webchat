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
                        HttpContext httpContext,
                        IEventBroadcaster broadcaster,
                        CancellationToken cancellationToken) =>
                    {
                        httpContext.Response.Headers.Append("Content-Type", "text/event-stream");

                        var reader = broadcaster.Subscribe();

                        await foreach (var (msgRoomId, data) in reader.ReadAllAsync(cancellationToken))
                        {
                            if (msgRoomId != roomId) continue;

                            await httpContext.Response.WriteAsync("event: messageReceived\n", cancellationToken);
                            await httpContext.Response.WriteAsync("data: ", cancellationToken);
                            await JsonSerializer.SerializeAsync(httpContext.Response.Body, data, cancellationToken: cancellationToken);
                            await httpContext.Response.WriteAsync("\n\n", cancellationToken);
                            await httpContext.Response.Body.FlushAsync(cancellationToken);
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
