# Image Analysis Application - Setup Guide

## Overview
This Razor Pages application provides a user-friendly interface for uploading and analyzing images using Azure AI Vision services. The application validates uploaded images according to specific requirements and displays analysis results with bounding boxes.

## Features

### Image Upload Requirements
- **Format**: JPEG, PNG, GIF, or BMP only
- **Size**: Maximum 4MB
- **Dimensions**: Minimum 50x50 pixels

### UI Features
- Drag & drop file upload
- Real-time image preview
- Client-side validation
- File information display
- Progress indicators during analysis
- Responsive design with Bootstrap

### Analysis Results
- Image caption with confidence score
- Object detection with bounding boxes (red)
- People detection with bounding boxes (green)
- Tags and metadata
- Visual overlay of detected items

## Setup Instructions

### 1. Azure Vision Service Configuration
1. Create an Azure AI Vision resource in the Azure portal
2. Copy the endpoint URL and API key
3. Update the `appsettings.json` file:

```json
{
  "AzureVision": {
    "Endpoint": "https://your-vision-endpoint.cognitiveservices.azure.com/",
    "ApiKey": "your-api-key-here"
  }
}
```

### 2. Dependencies
The application includes the following NuGet packages:
- `Azure.AI.Vision.ImageAnalysis` (v1.0.0)
- `SixLabors.ImageSharp` (v3.1.11)

### 3. Running the Application
1. Set the Azure Vision configuration in `appsettings.json`
2. Run the application using `dotnet run`
3. Navigate to the home page
4. Upload an image using the file picker or drag & drop
5. Click "Analyze Image" to process the image

## File Structure

### Core Files
- `Pages/Index.cshtml` - Main upload and analysis UI
- `Pages/Index.cshtml.cs` - Page model with upload and validation logic
- `Services/ImageAnalysis/IVisionImageAnalysys.cs` - Service interface
- `Services/ImageAnalysis/VisionImageAnalysys.cs` - Azure Vision service implementation
- `Configuration/AzureVision.cs` - Configuration model

### Frontend Files
- `wwwroot/css/site.css` - Custom styles for upload UI and results
- `wwwroot/js/site.js` - Client-side validation and drag & drop functionality
- `Pages/Shared/_Layout.cshtml` - Layout with FontAwesome icons

## Validation Logic

### Client-Side (JavaScript)
- File type validation
- File size validation (4MB limit)
- Image dimension validation (50x50 minimum)
- Real-time feedback and error messages

### Server-Side (C#)
- File extension validation
- File size validation
- Image dimension validation using ImageSharp
- Error handling and user feedback

## Analysis Features

### Object Detection
- Detects objects in images
- Draws red bounding boxes around detected objects
- Shows object names and confidence scores

### People Detection
- Identifies people in images
- Draws green bounding boxes around detected people
- Counts total number of people found

### Image Captioning
- Generates descriptive captions for images
- Shows confidence scores for captions

### Tagging
- Identifies relevant tags for image content
- Displays top tags with confidence scores

## Troubleshooting

### Common Issues
1. **Configuration Error**: Ensure Azure Vision endpoint and API key are correctly set
2. **File Upload Issues**: Check file format, size, and dimensions meet requirements
3. **Analysis Errors**: Verify Azure Vision service is active and accessible

### Error Messages
- Invalid file format: Only JPEG, PNG, GIF, and BMP are supported
- File too large: Maximum size is 4MB
- Image too small: Minimum dimensions are 50x50 pixels
- Service errors: Check Azure Vision service configuration

## Security Considerations
- File uploads are validated for type and size
- Images are processed in memory only
- No persistent storage of uploaded images
- API keys should be stored securely (consider Azure Key Vault for production)

## Browser Support
- Modern browsers with HTML5 File API support
- Drag & drop functionality requires modern browser
- Canvas support required for bounding box overlay
- Responsive design works on mobile and desktop