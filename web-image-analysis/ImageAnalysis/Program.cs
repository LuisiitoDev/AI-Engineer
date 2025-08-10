using ImageAnalysis.Configuration;
using ImageAnalysis.Services.ImageAnalysis;
using ImageAnalysis.Hubs;
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddSignalR(options =>
{
    options.MaximumReceiveMessageSize = 10 * 1024 * 1024;
});

// Configure Azure Vision
builder.Services.Configure<AzureVision>(
    builder.Configuration.GetSection("AzureVision"));

// Register Vision service
builder.Services.AddSingleton<IVisionImageAnalysys, VisionImageAnalysys>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

// Map SignalR hub
app.MapHub<AnalysisHub>("/analysisHub");

app.Run();
