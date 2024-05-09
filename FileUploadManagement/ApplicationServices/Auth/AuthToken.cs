using FileUploadManagement.DAO;
using FileUploadManagement.Models.HttpOut;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace FileUploadManagement.Controllers
{
    public interface IAuthToken
    {
        DataResponse AuthCurrentToken(string token);
    }

    public class AuthToken : IAuthToken
    {
        /// <summary>
        /// Função que verifica se o Token passado está válido ou não.
        /// Se estiver válido, retorna os devidos claims.
        /// Se inválido, retorna 401.
        /// </summary>
        /// <param name="token">Token de conexão</param>
        /// <returns>Claims</returns>
        public DataResponse AuthCurrentToken(string token)
        {
            if (string.IsNullOrEmpty(token)) return DataResponse.ResultadoInvalido(401, "O Token está vazio ou nulo.");

            if (Settings.config is null) return DataResponse.ResultadoInvalido(500, "Algum erro ocorreu com as configurações de conexão interno.");

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var secret = Settings.config.GetSection("Token:SecretKey").Value;
                var key = Encoding.ASCII.GetBytes(secret);


                tokenHandler.ReadJwtToken(token);

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateLifetime = true,
                    ValidateAudience = true,
                    ValidateIssuer = true,
                    ValidIssuer = "http://www.avipam.com.br",
                    ValidAudience = "usuario",
                }, out SecurityToken validatedToken);
                var jwtToken = (JwtSecurityToken)validatedToken;

                List<Claim> roleClaim = new()
                {
                    jwtToken.Claims.First(el => el.Type == "ADMIN"),
                    jwtToken.Claims.First(el => el.Type == "IMPLEMENTACAO"),
                    jwtToken.Claims.First(el => el.Type == "CONTROLLER"),
                    jwtToken.Claims.First(el => el.Type == "CADASTRO"),
                    jwtToken.Claims.First(el => el.Type == "SUPORTE"),
                    jwtToken.Claims.First(el => el.Type == "PRODUTOS")
                };

                // Pegar os claims do token
                dynamic claims = "{";

                for (var i = 0; i < jwtToken.Claims.ToArray().Length; i++)
                {
                    claims += "'" + jwtToken.Claims.ToArray()[i].Type + "': '" + jwtToken.Claims.ToArray()[i].Value + "', ";
                }
                if (roleClaim.All(el => el.Value == "N"))
                    claims += "'Ok': 'false'";
                else
                    claims += "'Ok': 'true'";

                claims += "}";

                var res = JsonConvert.SerializeObject(JsonConvert.DeserializeObject(claims), Formatting.Indented);

                return DataResponse.ResultadoValido(res);

            }
            catch (SecurityTokenExpiredException ex)
            {
                return DataResponse.ResultadoInvalido(401, ex.Message);
            }
            catch (Exception ex)
            {
                return DataResponse.ResultadoInvalido(400, ex.Message);
            }
        }
    }
}
