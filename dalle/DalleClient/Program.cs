using System.Diagnostics;
using Azure;
using Azure.AI.OpenAI;
using Azure.Identity;
using OpenAI.Images;

var openAI = new AzureOpenAIClient(
    new Uri(Environment.GetEnvironmentVariable("AZURE_ENDPOINT")!),
    new AzureKeyCredential(Environment.GetEnvironmentVariable("AZURE_KEY")!)
);

var client = openAI.GetImageClient("dall-e-3");

var options = new ImageGenerationOptions()
{
    Quality = GeneratedImageQuality.High,
    Size = GeneratedImageSize.W1792xH1024,
    Style = GeneratedImageStyle.Vivid,
    ResponseFormat = GeneratedImageFormat.Bytes
};

string prompt = "";


do
{

    Console.WriteLine("Please provide a brief description for the image that you want. Type 'quite' for exit.");
    prompt = Console.ReadLine()!;


    var image = client.GenerateImage(prompt, options);
    var bytes = image.Value.ImageBytes;

    var fileName = $"{Guid.CreateVersion7()}.png";
    using var stream = File.OpenWrite(fileName);
    bytes.ToStream().CopyTo(stream);
    

} while (prompt != "quit");



