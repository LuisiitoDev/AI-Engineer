using System.ComponentModel.DataAnnotations;
using Azure;
using Azure.Search.Documents;
using Azure.Search.Documents.Models;


var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration.GetSection("Search");

string endpoint = configuration["Endpoint"]!;
string apiKey = configuration["ApiKey"]!;
string indexName = configuration["IndexName"]!;


var searchClient = new SearchClient(
    new Uri(endpoint),
    indexName,
    new AzureKeyCredential(apiKey)
);



var app = builder.Build();

app.MapGet("/Search", async ([Required] string q) =>
{
    var options = new SearchOptions { IncludeTotalCount = true };
    var response = await searchClient.SearchAsync<dynamic>(q, options);
    var result = response.Value.GetResults().Select(r => r.Document);
    return Results.Ok(result);
});

app.Run();
