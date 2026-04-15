using Microsoft.AspNetCore.SignalR;

namespace TikFinityBackend.Hubs;

public class TikFinityHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var channelId = Context.GetHttpContext()?.Request.Query["channelId"].FirstOrDefault();
        if (!string.IsNullOrEmpty(channelId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"channel_{channelId}");
        }

        await Clients.Caller.SendAsync("authenticated", new
        {
            status = "ok",
            channelId,
            authenticated = true
        });

        await Clients.Caller.SendAsync("ready", new { status = "ok" });

        await Clients.Caller.SendAsync("channelStatus", new
        {
            connected = false,
            channelId,
            status = "disconnected"
        });

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var channelId = Context.GetHttpContext()?.Request.Query["channelId"].FirstOrDefault();
        if (!string.IsNullOrEmpty(channelId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"channel_{channelId}");
        }
        await base.OnDisconnectedAsync(exception);
    }

    // Client can call these methods
    public async Task JoinChannel(string channelId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"channel_{channelId}");
    }

    public async Task SendEvent(string channelId, string eventType, object data)
    {
        await Clients.Group($"channel_{channelId}").SendAsync(eventType, data);
    }
}
