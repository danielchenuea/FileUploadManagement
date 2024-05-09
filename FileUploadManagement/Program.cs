using FileUploadManagement;
using FileUploadManagement.ApplicationServices;
using FileUploadManagement.AuthApplicationServices;
using FileUploadManagement.Controllers;
using FileUploadManagement.DAO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

Settings.Initialize(builder.Configuration);

// Add services to the container.
builder.Services
    .AddControllersWithViews()
    .AddRazorRuntimeCompilation()
    .AddNewtonsoftJson()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });


if (Settings.config is not null)
{
    string chave = Settings.config.GetSection("Token:SecretKey").Value;
    //Simetric key
    var chaveSimetrica = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(chave));
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "http://www.avipam.com.br",
            ValidAudience = "usuario",
            IssuerSigningKey = chaveSimetrica
        };
    });
}

builder.Services.AddAuthorization(options =>
{
    // ["ADMIN", "IMPLEMENTACAO", "CONTROLLER", "CADASTRO", "SUPORTE", "PRODUTOS"]
    options.AddPolicy("AdminSection", policy => policy.RequireAssertion(context =>
    {
        var claimAdmin = context.User.Claims.FirstOrDefault(el => el.Type == "ADMIN");

        if (claimAdmin == null) return false;
        return claimAdmin.Value == "S";
    }
    ));
});

builder.Services.AddTransient<IAuthApplictionServices, AuthApplication>();
builder.Services.AddTransient<IAuthToken, AuthToken>();
builder.Services.AddTransient<IFileUploadApplicationServices, FileUploadApplicationServices>();
builder.Services.AddTransient<IPersistenciaDB, PersistenciaDB>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// Error page if no match
app.Use(async (context, next) =>
{
    await next();
    if (context.Response.StatusCode == 404)
    {
        context.Request.Path = "/ErrorPage";
        await next();
    }
});

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();
app.UseCookiePolicy();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
