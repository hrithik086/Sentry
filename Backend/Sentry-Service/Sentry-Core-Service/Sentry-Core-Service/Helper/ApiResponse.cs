using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;

namespace Sentry.Core.Service.Helper;

public class ApiResponse<T>
{
    public T Data { get; set; }
    public bool IsSuccess { get; set; }
    
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool IsError { get; set; }
    
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? ErrorMessage { get; set; }
    
    public ApiResponse(){}
    
    public ApiResponse(T data)
    {
        Data = data;
        IsSuccess = true;
        IsError = false;
        ErrorMessage = null;
    }
    
    public ApiResponse(T data, string errorMessage)
    {
        Data = data;
        IsSuccess = false;
        IsError = true;
        ErrorMessage = errorMessage;
    }
}