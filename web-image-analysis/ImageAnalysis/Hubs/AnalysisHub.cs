using Microsoft.AspNetCore.SignalR;
using ImageAnalysis.Services.ImageAnalysis;
using Azure.AI.Vision.ImageAnalysis;
using SixLabors.ImageSharp;

namespace ImageAnalysis.Hubs
{
    public class AnalysisHub : Hub
    {
        private readonly IVisionImageAnalysys _visionService;

        public AnalysisHub(IVisionImageAnalysys visionService)
        {
            _visionService = visionService;
        }

        public async Task AnalyzeImage(string base64Image)
        {
            try
            {
                // Decode the base64 image
                var imageData = Convert.FromBase64String(base64Image);

                // Validate image dimensions using ImageSharp
                using var image = SixLabors.ImageSharp.Image.Load(new MemoryStream(imageData));
                if (image.Width < 50 || image.Height < 50)
                {
                    await Clients.Caller.SendAsync("AnalysisFailed", "Image dimensions must be at least 50x50 pixels.");
                    return;
                }

                // Analyze the image
                var analysisResult = await _visionService.Analyze(imageData);

                // Send analysis results back to the client
                await Clients.Caller.SendAsync("ReceiveAnalysis", new
                {
                    ImageDataUrl = $"data:image/png;base64,{Convert.ToBase64String(imageData)}",
                    AnalysisResult = analysisResult
                });
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("AnalysisFailed", "An error occurred while processing the image. Please try again.");
            }
        }
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            await Clients.Caller.SendAsync("Connected", "You are now connected to the AnalysisHub.");
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
            await Clients.Caller.SendAsync("Disconnected", "You have been disconnected from the AnalysisHub.");
        }
    }
}