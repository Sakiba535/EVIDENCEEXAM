using Microsoft.AspNetCore.SignalR;

namespace WebApplication1.Hubs
{
    public class ChatHub:Hub
    {
        public async Task TextShare(string user,string message)
        {
            await Clients.All.SendAsync("msgRcv", user, message);
        }
        public async Task ImageShare(string user, string imageData)
        {
            await Clients.All.SendAsync("imgRcv", user, imageData);
        }
    }
}
