using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.SignalR;
using System.ComponentModel.DataAnnotations;
using ImageAnalysis.Services.ImageAnalysis;
using ImageAnalysis.Hubs;
using Azure.AI.Vision.ImageAnalysis;
using SixLabors.ImageSharp;

namespace ImageAnalysis.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        private readonly IVisionImageAnalysys _visionService;
        private readonly IHubContext<AnalysisHub> _hubContext;

        public IndexModel(ILogger<IndexModel> logger, IVisionImageAnalysys visionService, IHubContext<AnalysisHub> hubContext)
        {
            _logger = logger;
            _visionService = visionService;
            _hubContext = hubContext;
        }

        [BindProperty]
        public InputModel Input { get; set; } = new();

        public class InputModel
        {
            [Required(ErrorMessage = "Please select an image file")]
            [Display(Name = "Image File")]
            public IFormFile? ImageFile { get; set; }
        }

        public void OnGet()
        {
        }

        //public async Task<IActionResult> OnPostAsync()
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return Page();
        //    }

        //    try
        //    {
        //        var file = Input.ImageFile!;

        //        // Validate file format
        //        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp" };
        //        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        //        if (!allowedExtensions.Contains(extension))
        //        {
        //            ModelState.AddModelError("Input.ImageFile", "Invalid file format. Only JPEG, PNG, GIF, and BMP files are allowed.");
        //            return Page();
        //        }

        //        // Validate file size (4MB = 4 * 1024 * 1024 bytes)
        //        const long maxFileSize = 4 * 1024 * 1024;
        //        if (file.Length > maxFileSize)
        //        {
        //            ModelState.AddModelError("Input.ImageFile", "File size must be less than 4MB.");
        //            return Page();
        //        }

        //        // Read file into byte array
        //        byte[] imageData;
        //        using (var memoryStream = new MemoryStream())
        //        {
        //            await file.CopyToAsync(memoryStream);
        //            imageData = memoryStream.ToArray();
        //        }

        //        // Validate image dimensions using ImageSharp
        //        using var image = SixLabors.ImageSharp.Image.Load(new MemoryStream(imageData));
        //        if (image.Width < 50 || image.Height < 50)
        //        {
        //            ModelState.AddModelError("Input.ImageFile", "Image dimensions must be at least 50x50 pixels.");
        //            return Page();
        //        }

        //        // Analyze the image asynchronously
        //        _ = Task.Run(async () =>
        //        {
        //            try
        //            {
        //                var analysisResult = await _visionService.Analyze(imageData);

        //                // Send analysis results to the client via SignalR
        //                await _hubContext.Clients.All.SendAsync("ReceiveAnalysis", new
        //                {
        //                    ImageDataUrl = $"data:{file.ContentType};base64,{Convert.ToBase64String(imageData)}",
        //                    AnalysisResult = analysisResult
        //                });
        //            }
        //            catch (Exception ex)
        //            {
        //                _logger.LogError(ex, "Error during image analysis");
        //            }
        //        });

        //        // Stay on the same page and show a loading indicator
        //        ViewData["Processing"] = true;
        //        return Page();
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Error processing image");
        //        ModelState.AddModelError(string.Empty, "An error occurred while processing the image. Please try again.");
        //        return Page();
        //    }
        //}
    }
}
