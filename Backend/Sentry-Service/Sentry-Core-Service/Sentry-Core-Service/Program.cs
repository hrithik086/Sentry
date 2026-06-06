using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Sentry.Core.Service.Filters;
using Sentry.Core.Service.Helper;
using Sentry.Core.Service.Repository.Db;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(options => 
    options.Filters.Add<RequestModelValidationFilter>()
    );
builder.Services.AddOpenApi();

builder.Services.AddDbContext<SentrySqlDbContext>(options => 
    options.UseNpgsql(builder.Configuration
            .GetConnectionString("SqlDbConnectionString"))
    );

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "http://localhost:8080/realms/My%20Test%20Realm";
        options.Audience = "account";
        options.RequireHttpsMetadata = false;
    });
builder.Services.AddAuthorization();

builder.Services.AddSentryCoreDependencies();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options => options.SwaggerEndpoint("/openapi/v1.json", "v1"));
}
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();

app.MapControllers().RequireAuthorization();
app.Run();