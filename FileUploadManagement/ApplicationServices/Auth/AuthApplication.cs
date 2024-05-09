using FileUploadManagement;
using FileUploadManagement.DAO;
using FileUploadManagement.Models;
using FileUploadManagement.Models.HttpOut;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FileUploadManagement.AuthApplicationServices
{
    public interface IAuthApplictionServices
    {
        DataResponse GetToken(string user, string password);
    }

    public class AuthApplication : ControllerBase, IAuthApplictionServices
    {
        private readonly IPersistenciaDB _persistenciaDB;

        public AuthApplication()
        {
            _persistenciaDB = new PersistenciaDB();
        }
        public AuthApplication(IPersistenciaDB persistenciaDB)
        {
            _persistenciaDB = persistenciaDB;
        }

        /// <summary>
        /// Função que pega o usuário e senha e verifica se eles correspondem.
        /// Se o Login for válido, cria um token e retorna ele.
        /// </summary>
        /// <param name="user">Login do usuário</param>
        /// <param name="password">Senha do usuário</param>
        /// <returns>Token de conexão</returns>
        public DataResponse GetToken(string user, string password)
        {
            //if (Settings.config is null) throw new Exception("Algum erro ocorreu com a conexão ao servidor.");
            // chave

            try
            {
                // Para testes
                var chaveSimetrica = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("0123456789abcdef0123456789abcdef"));
                var assinatura = new SigningCredentials(chaveSimetrica, SecurityAlgorithms.HmacSha256Signature);
                if (Settings.config != null)
                {
                    string chave = Settings.config!.GetSection("Token:SecretKey").Value;
                    chaveSimetrica = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(chave));
                    assinatura = new SigningCredentials(chaveSimetrica, SecurityAlgorithms.HmacSha256Signature);
                }

                // Get User
                QueryExecution qeUserData = GetUserDataQuery(user);
                DataTable dtUser = _persistenciaDB.ExecuteDataQuery(qeUserData);

                if (dtUser.Rows.Count != 1)
                {
                    return DataResponse.ResultadoInvalido(401, "Usuario e/ou senha não estão corretos.");
                }
                DataRow UserData = dtUser.Rows[0];

                string nomeUsuario = UserData["NOMECOMPLETO"].ToString() ?? "";
                string usuario = UserData["USUARIO"].ToString() ?? "";
                string email = UserData["ENDERECOEMAIL"].ToString() ?? "";
                string senha = UserData["SENHA"].ToString() ?? "";
                string perfil = UserData["PERFIL"].ToString() ?? "";
                string tipoUsuarioString = UserData["TIPODEUSUARIO"].ToString() ?? "";
                string permissaoAdmin = UserData["ADMCARTOESAVIPAM"].ToString() ?? "";
                string setorUsuario = UserData["FATURAMENTO"].ToString() ?? "+";

                string tipoUsuarioHash = UserData["TIPODEUSUARIO"].GetHashCode().ToString();
                string setorUsuarioHash = UserData["FATURAMENTO"].GetHashCode().ToString();

                Dictionary<string, string> permissoesUsuario = new() {
                    {
                        "ADMIN", dtUser.Columns.Contains("GESTAOACESSOS") && UserData["GESTAOACESSOS"].ToString() != null ?
                            UserData["GESTAOACESSOS"].ToString()! == "1" ? "S" : "N"
                        : "N"
                    },
                    {
                        "IMPLEMENTACAO", dtUser.Columns.Contains("GESTAOACESSOS") && UserData["GESTAOACESSOS"].ToString() != null ?
                            UserData["GESTAOACESSOS"].ToString()! == "2" ? "S" : "N"
                        : "N"
                    },
                    {
                        "CONTROLLER", dtUser.Columns.Contains("GESTAOACESSOS") && UserData["GESTAOACESSOS"].ToString() != null ?
                            UserData["GESTAOACESSOS"].ToString()! == "3" ? "S" : "N"
                        : "N"
                    },
                    {
                        "CADASTRO", dtUser.Columns.Contains("GESTAOACESSOS") && UserData["GESTAOACESSOS"].ToString() != null ?
                            UserData["GESTAOACESSOS"].ToString()! == "4" ? "S" : "N"
                        : "N"
                    },
                    {
                        "SUPORTE", dtUser.Columns.Contains("GESTAOACESSOS") && UserData["GESTAOACESSOS"].ToString() != null ?
                            UserData["GESTAOACESSOS"].ToString()! == "5" ? "S" : "N"
                        : "N"
                    },
                    {
                        "PRODUTOS", dtUser.Columns.Contains("GESTAOACESSOS") && UserData["GESTAOACESSOS"].ToString() != null ?
                            UserData["GESTAOACESSOS"].ToString()! == "6" ? "S" : "N"
                        : "N"
                    }
                };

                if (password != senha)
                    return DataResponse.ResultadoInvalido(401, "Usuario e/ou senha não estão corretos.");

                if (permissoesUsuario.Values.All(el => el == "N"))
                {
                    return DataResponse.ResultadoInvalido(401, "Esse usuário não possui permissão para acessar esse site. Contate um administrador.");
                }

                var claims = new List<Claim>
                {
                    new("Usuario", user),
                    new(ClaimTypes.Email, email),
                    new("NomeUsuario", nomeUsuario),
                    new("Perfil", perfil),
                    new("TipoUsuario", tipoUsuarioString),
                    new("Auth", tipoUsuarioHash),
                    new("Setor", setorUsuarioHash),
                    //new(identity.)
                    new(ClaimTypes.Role, "ADMIN")
                };
                permissoesUsuario.Keys.ToList().ForEach(perm =>
                {
                    claims.Add(new(perm, permissoesUsuario[perm]));
                });

                //retorna token
                var token = new JwtSecurityToken(
                    issuer: "http://www.avipam.com.br",
                    audience: "usuario",
                    expires: DateTime.Now.AddHours(8),
                    signingCredentials: assinatura,
                    claims: claims
                );

                var Dados_autenticados = new Authentic
                {
                    Usuario = user,
                    Token = new JwtSecurityTokenHandler().WriteToken(token),
                    Auth = tipoUsuarioHash,
                    TpUsuario = tipoUsuarioString,
                    Setor = setorUsuario
                };

                return DataResponse.ResultadoValido(Dados_autenticados);

            }
            catch (Exception ex)
            {
                return DataResponse.ResultadoInvalido(400, ex.Message);
            }
        }

        /// <summary>
        /// Função que pega o Login e todos os acessos de um usuário.
        /// </summary>
        /// <param name="usuario">Nome do Usuário</param>
        /// <returns>Dados do usuário</returns>
        private static QueryExecution GetUserDataQuery(string usuario)
        {
            #region QueryInformation e SQL
            string sql = @"
SELECT 
    *
FROM
    INTRANET.LOGIN L,
    INTRANET.LOGIN_ACESSOS LA
WHERE
    L.USUARIO = LA.USUARIO
AND L.USUARIO = :USUARIO  
";
            var vlUsuario = new OracleParameter("USUARIO", OracleDbType.Varchar2, 20) { Value = usuario };

            OracleParameter[] param = new OracleParameter[] {
                vlUsuario
            };
            #endregion

            return QueryExecution.CreateQuery(sql, param);
        }
    }
}
