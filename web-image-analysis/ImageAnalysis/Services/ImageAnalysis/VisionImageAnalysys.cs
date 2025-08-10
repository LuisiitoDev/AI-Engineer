using Azure;
using Azure.AI.Vision.ImageAnalysis;
using ImageAnalysis.Configuration;
using Microsoft.Extensions.Options;

namespace ImageAnalysis.Services.ImageAnalysis;

public class VisionImageAnalysys(IOptionsMonitor<AzureVision> options) : IVisionImageAnalysys
{
    private readonly Lazy<ImageAnalysisClient> _client = new(() =>
    {
        var azureVision = options.CurrentValue;
        return new ImageAnalysisClient(
            new Uri(azureVision.Endpoint),
            new AzureKeyCredential(azureVision.ApiKey));
    });

    public async Task<ImageAnalysisResult> Analyze(byte[] image)
    {
        var result = await _client.Value.AnalyzeAsync(
                            BinaryData.FromStream(new MemoryStream(image)),
                            visualFeatures: VisualFeatures.Caption |
                                            VisualFeatures.DenseCaptions |
                                            VisualFeatures.Tags |
                                            VisualFeatures.Objects |
                                            VisualFeatures.People |
                                            VisualFeatures.Read,
                            new ImageAnalysisOptions() { GenderNeutralCaption = true });

        return result;
    }

}
