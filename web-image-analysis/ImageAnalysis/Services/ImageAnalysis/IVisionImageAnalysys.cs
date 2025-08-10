using Azure.AI.Vision.ImageAnalysis;

namespace ImageAnalysis.Services.ImageAnalysis;

public interface IVisionImageAnalysys
{
    Task<ImageAnalysisResult> Analyze(byte[] image);
}
