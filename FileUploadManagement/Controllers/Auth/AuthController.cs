using FileUploadManagement.AuthApplicationServices;
using FileUploadManagement.Models.HttpIn;
using FileUploadManagement.Models.HttpOut;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FileUploadManagement.Controllers.Auth
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]

    public class AuthController : ControllerBase
    {
        private readonly IAuthApplictionServices AuthApplicationServices;
        private readonly IAuthToken AuthTokenApplicationServices;

        public AuthController(IAuthApplictionServices AuthApplicationServices, IAuthToken AuthTokenApplicationServices)
        {
            this.AuthApplicationServices = AuthApplicationServices;
            this.AuthTokenApplicationServices = AuthTokenApplicationServices;
        }

        [HttpPost]
        public IActionResult Post(LoginDTO Login)
        {
            if (string.IsNullOrWhiteSpace(Login.User) || string.IsNullOrWhiteSpace(Login.Password))
            {
                return BadRequest(DataResponse.ResultadoInvalido(400, "Usuario e Senha não podem ser vazios."));
            }

            var data = AuthApplicationServices.GetToken(Login.User, Login.Password);

            if (data.Error && data.ResponseCode == 401) return Unauthorized(data);
            if (data.Error) return BadRequest(data);

            return Ok(data.Data);
        }

        [HttpPost("token")]
        public IActionResult AuthToken(TokenModelDTO token)
        {
            if (string.IsNullOrWhiteSpace(token.Token))
                return BadRequest(DataResponse.ResultadoInvalido(400, "O Token enviado parece vazio ou nulo."));


            DataResponse data = AuthTokenApplicationServices.AuthCurrentToken(token.Token);

            if (data.Error && data.ResponseCode == 401) return Unauthorized(data);
            if (data.Error) return BadRequest(data);

            return Ok(data.Data);
        }
    }
}
