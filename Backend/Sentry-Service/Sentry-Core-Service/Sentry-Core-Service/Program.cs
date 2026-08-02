using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Sentry.Core.Service.Filters;
using Sentry.Core.Service.Helper;
using Sentry.Core.Service.Helper.AutoMapper;
using Sentry.Core.Service.Repository.Db;
using Sentry.Core.Service.Repository.NoSqlDb;

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
builder.Services.AddDbContext<SentryNoSqlDbContext>(options =>
{
    var mongodbConnectionString = builder.Configuration
                                    .GetConnectionString("MongoDbConnectionString:ConnectionString");
    var databaseName = builder.Configuration.GetConnectionString("MongoDbConnectionString:DatabaseName");
    options.UseMongoDB(mongodbConnectionString, databaseName);
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "http://localhost:8080/realms/My%20Test%20Realm";
        options.Audience = "account";
        options.RequireHttpsMetadata = false;
    });
builder.Services.AddAuthorization();

builder.Services.AddSentryCoreDependencies();
builder.Services.AddSentryAutoMapper();
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