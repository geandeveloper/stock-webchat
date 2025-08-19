using Refit;
using WebChatApi;
using WebChatApi.Bots.Stock;
using WebChatApi.EventHandlers;
using WebChatApi.Events.Room;
using WebChatApi.Rooms.SendMessage;
using WebChatApi.Storage;

var builder = WebApplication.CreateBuilder(args);


//cors
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

//command handler
builder.Services.AddTransient<SendMessageHandler>();

builder.Services.AddSingleton(builder.Configuration
         .GetSection("RabbitMQ")
         .Get<RabbitMqEventHandlerSettings>()!);


//event handlers (background bots)
builder.Services.AddSingleton<IEventHandler<MessageSent>, StockBotEventHandler>();
    
//events
builder.Services.AddSingleton<IEventPublisher>(sp =>
{
    var settings = sp.GetRequiredService<RabbitMqEventHandlerSettings>();
    var publisher = new EventPublisher(settings);

    publisher.InitializeAsync().GetAwaiter().GetResult();

    return publisher;
});

builder.Services.AddSingleton<IChatStorage, InMemoryChatStorage>();
builder.Services.AddSingleton<IEventBroadcaster, EventBroadcaster>();
builder.Services.AddHostedService<EventHandlerConsumer>();


//refit/gateways
var stooqBaseUrl = builder.Configuration["StooqApi:BaseUrl"]!;
builder.Services.AddRefitClient<IStooqApi>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri(stooqBaseUrl));

var app = builder.Build();

app.MapChatApi();

app.UseCors();
app.Run();
