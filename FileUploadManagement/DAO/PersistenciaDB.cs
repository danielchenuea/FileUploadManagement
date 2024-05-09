using FileUploadManagement;
using Microsoft.Extensions.Primitives;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileUploadManagement.DAO
{
    public class QueryExecution
    {
        public string QueryString { get; set; } = string.Empty;
        public IEnumerable<OracleParameter>? Parameters { get; set; } = null;

        public QueryExecution(string Query)
        {
            QueryString = Query;
        }
        public QueryExecution(string Query, IEnumerable<OracleParameter> parameters)
        {
            QueryString = Query;
            Parameters = parameters;
        }

        public static QueryExecution CreateQuery(string query) => new(query);
        public static QueryExecution CreateQuery(string query, IEnumerable<OracleParameter> parameters) => new(query, parameters);
    }

    public interface IPersistenciaDB
    {
        IEnumerable<DataTable> ExecuteAllDataQueries(IEnumerable<QueryExecution> queryExecution);
        IDictionary<string, DataTable> ExecuteAllDataQueries(IDictionary<string, QueryExecution> queryExecution);

        IEnumerable<bool> ExecuteAllNoReturnQueries(IEnumerable<QueryExecution> queryExecution);
        IDictionary<string, bool> ExecuteAllNoReturnQueries(IDictionary<string, QueryExecution> queryExecution);

        DataTable ExecuteDataQuery(QueryExecution queryExecution);
        bool ExecuteNoReturnQuery(QueryExecution queryExecution);
    }

    public class PersistenciaDB : IPersistenciaDB
    {
        /// <summary>
        /// Função que executa uma Query junto de seus parâmetros.
        /// </summary>
        /// <param name="queryExecution">Objeto que contêm a String da Query e os Parâmetros dela</param>
        /// <returns>DataTable das informações da query</returns>
        public DataTable ExecuteDataQuery(QueryExecution queryExecution)
        {
            if (Settings.config is null) throw new Exception("Algum erro ocorreu com a conexão ao servidor.");

            OracleConnection cn = new(Settings.config.GetSection("API:CONNECTION_STRING").Value);
            OracleCommand cmd = new(queryExecution.QueryString, cn);
            OracleTransaction t;
            OracleDataReader dr;
            DataTable dt = new();

            cn.Open();

            if (queryExecution.Parameters is not null)
            {
                cmd.Parameters.AddRange(queryExecution.Parameters.ToArray());
            }
            t = cn.BeginTransaction();
            cmd.Transaction = t;

            try
            {
                dr = cmd.ExecuteReader();
                dt.Load(dr);
                t.Commit();
            }
            catch (Exception ex)
            {
                t.Rollback();
                throw new Exception("Algum erro acontenceu na execução da query. " + ex.Message);
            }

            if ((cn != null) && cn.State == ConnectionState.Open)
            {
                cn.Close();
                cn.Dispose();
            }

            return dt;
        }

        /// <summary>
        /// Função que executa uma Query junto de seus parâmetros.
        /// Sua principal diferença é que ela verifica se a query afetou alguma linha e retorna um boolean.
        /// Se as linhas afetados foram > 0. Então a função retorna true.
        /// </summary>
        /// <param name="queryExecution">Objeto que contêm a String da Query e os Parâmetros dela</param>
        /// <returns>Boolean. True se linhas afetadas > 0</returns>
        public bool ExecuteNoReturnQuery(QueryExecution queryExecution)
        {
            if (Settings.config is null) throw new Exception("Algum erro ocorreu com a conexão ao servidor.");

            OracleConnection cn = new(Settings.config.GetSection("API:CONNECTION_STRING").Value);
            OracleCommand cmd = new(queryExecution.QueryString, cn);
            OracleTransaction t;
            OracleDataReader dr;

            cn.Open();

            if (queryExecution.Parameters is not null)
            {
                cmd.Parameters.AddRange(queryExecution.Parameters.ToArray());
            }
            t = cn.BeginTransaction();
            cmd.Transaction = t;

            bool dt = false;
            try
            {
                dr = cmd.ExecuteReader();

                if (dr.RecordsAffected > 0)
                {
                    dt = true;
                }
                t.Commit();
            }
            catch (Exception ex)
            {
                t.Rollback();
                throw new Exception("Algum erro acontenceu na execução da query. " + ex.Message);
            }

            if ((cn != null) && cn.State == ConnectionState.Open)
            {
                cn.Close();
                cn.Dispose();
            }

            return dt;
        }

        /// <summary>
        /// Função que executa uma Lista de Queries junto de seus parâmetros.
        /// Tem a mesma funcionalidade do 'ExecuteDataQuery'. A diferença é que ela executa uma lista de 
        /// queries antes da conexão ser fechada.
        /// Dessa maneira, uma Lista de DataTables será retornado.
        /// </summary>
        /// <param name="queryExecution">Uma lista de Objetos que contêm a String da Query e os Parâmetros dela</param>
        /// <returns>Lista de DataTables de mesmo tamanho da entrada.</returns>
        public IEnumerable<DataTable> ExecuteAllDataQueries(IEnumerable<QueryExecution> queryExecution)
        {
            if (Settings.config is null) throw new Exception("Algum erro ocorreu com a conexão ao servidor.");

            OracleConnection cn = new(Settings.config.GetSection("API:CONNECTION_STRING").Value);
            List<OracleCommand> cmd = new() { };
            OracleTransaction t;

            List<DataTable> dt = new();

            cn.Open();
            t = cn.BeginTransaction();

            foreach (QueryExecution queryInfo in queryExecution)
            {
                cmd.Add(new OracleCommand(queryInfo.QueryString, cn));

                if (queryInfo.Parameters is not null)
                {
                    cmd.Last().Parameters.AddRange(queryInfo.Parameters.ToArray());
                }
                cmd.Last().Transaction = t;
            }

            try
            {
                foreach (OracleCommand oracleCommand in cmd)
                {
                    OracleDataReader dr_temp = oracleCommand.ExecuteReader();
                    DataTable dt_temp = new();

                    dt_temp.Load(dr_temp);

                    dt.Add(dt_temp);
                }

                t.Commit();
            }
            catch (Exception ex)
            {
                t.Rollback();
                throw new Exception("Algum erro acontenceu na execução da query. " + ex.Message);
            }

            if ((cn != null) && cn.State == ConnectionState.Open)
            {
                cn.Close();
                cn.Dispose();
            }

            return dt;
        }

        /// <summary>
        /// Função que executa uma Lista de Queries junto de seus parâmetros.
        /// Tem a mesma funcionalidade do 'ExecuteNoReturnQuery'. A diferença é que ela executa uma lista de 
        /// queries antes da conexão ser fechada.
        /// Dessa maneira, uma Lista de Booleanos será retornado. A mesma regra do 'ExecuteNoReturnQuery' se aplica.
        /// </summary>
        /// <param name="queryExecution">Uma lista de Objetos que contêm a String da Query e os Parâmetros dela</param>
        /// <returns>Lista de Boolean de mesmo tamanho da entrada. True se linhas afetadas > 0</returns>
        public IEnumerable<bool> ExecuteAllNoReturnQueries(IEnumerable<QueryExecution> queryExecution)
        {
            if (Settings.config is null) throw new Exception("Algum erro ocorreu com a conexão ao servidor.");

            OracleConnection cn = new(Settings.config.GetSection("API:CONNECTION_STRING").Value);
            List<OracleCommand> cmd = new() { };
            OracleTransaction t;

            cn.Open();
            t = cn.BeginTransaction();

            foreach (QueryExecution queryInfo in queryExecution)
            {
                cmd.Add(new OracleCommand(queryInfo.QueryString, cn));

                if (queryInfo.Parameters is not null)
                {
                    cmd.Last().Parameters.AddRange(queryInfo.Parameters.ToArray());
                }
                cmd.Last().Transaction = t;
            }

            List<bool> oracleDataReaders = new();


            try
            {
                foreach (OracleCommand oracleCommand in cmd)
                {
                    OracleDataReader dr_temp = oracleCommand.ExecuteReader();

                    oracleDataReaders.Add(dr_temp.RecordsAffected > 0);
                }
                if (oracleDataReaders.Any(el => el == false)) throw new Exception("Uma das queries não foi executada corretamente.");
                t.Commit();
            }
            catch (Exception ex)
            {
                t.Rollback();
                throw new Exception("Algum erro acontenceu na execução da query. " + ex.Message);
            }

            if ((cn != null) && cn.State == ConnectionState.Open)
            {
                cn.Close();
                cn.Dispose();
            }

            return oracleDataReaders;
        }

        /// <summary>
        /// Função que executa uma Lista de Queries junto de seus parâmetros.
        /// Tem a mesma funcionalidade do 'ExecuteDataQuery'. A diferença é que ela executa uma lista de 
        /// queries antes da conexão ser fechada.
        /// Dessa maneira, uma Lista de DataTables será retornado.
        /// </summary>
        /// <param name="queryExecution">Uma lista de Objetos que contêm a String da Query e os Parâmetros dela</param>
        /// <returns>Lista de DataTables de mesmo tamanho da entrada.</returns>
        public IDictionary<string, DataTable> ExecuteAllDataQueries(IDictionary<string, QueryExecution> queryExecution)
        {
            if (Settings.config is null) throw new Exception("Algum erro ocorreu com a conexão ao servidor.");

            OracleConnection cn = new(Settings.config.GetSection("API:CONNECTION_STRING").Value);
            Dictionary<string, OracleCommand> cmd = new();
            OracleTransaction t;

            Dictionary<string, DataTable> dt = new();

            cn.Open();
            t = cn.BeginTransaction();

            foreach (var (key, queryExec) in queryExecution)
            {
                cmd.Add(key, new OracleCommand(queryExec.QueryString, cn));

                if (queryExec.Parameters is not null)
                {
                    cmd.Last().Value.Parameters.AddRange(queryExec.Parameters.ToArray());
                }
                cmd.Last().Value.Transaction = t;
            }

            try
            {
                foreach (var (key, oracleCommand) in cmd)
                {
                    OracleDataReader dr_temp = oracleCommand.ExecuteReader();
                    DataTable dt_temp = new();

                    dt_temp.Load(dr_temp);

                    dt.Add(key, dt_temp);
                }

                t.Commit();
            }
            catch (Exception ex)
            {
                t.Rollback();
                throw new Exception("Algum erro acontenceu na execução da query. " + ex.Message);
            }

            if ((cn != null) && cn.State == ConnectionState.Open)
            {
                cn.Close();
                cn.Dispose();
            }

            return dt;
        }

        /// <summary>
        /// Função que executa uma Lista de Queries junto de seus parâmetros.
        /// Tem a mesma funcionalidade do 'ExecuteNoReturnQuery'. A diferença é que ela executa uma lista de 
        /// queries antes da conexão ser fechada.
        /// Dessa maneira, uma Lista de Booleanos será retornado. A mesma regra do 'ExecuteNoReturnQuery' se aplica.
        /// </summary>
        /// <param name="queryExecution">Uma lista de Objetos que contêm a String da Query e os Parâmetros dela</param>
        /// <returns>Lista de Boolean de mesmo tamanho da entrada. True se linhas afetadas > 0</returns>
        public IDictionary<string, bool> ExecuteAllNoReturnQueries(IDictionary<string, QueryExecution> queryExecution)
        {
            if (Settings.config is null) throw new Exception("Algum erro ocorreu com a conexão ao servidor.");

            OracleConnection cn = new(Settings.config.GetSection("API:CONNECTION_STRING").Value);
            Dictionary<string, OracleCommand> cmd = new();
            OracleTransaction t;

            cn.Open();
            t = cn.BeginTransaction();

            foreach (var (key, queryInfo) in queryExecution)
            {
                cmd.Add(key, new OracleCommand(queryInfo.QueryString, cn));

                if (queryInfo.Parameters is not null)
                {
                    cmd.Last().Value.Parameters.AddRange(queryInfo.Parameters.ToArray());
                }
                cmd.Last().Value.Transaction = t;
            }

            Dictionary<string, bool> oracleDataReaders = new();

            try
            {
                foreach (var (key, oracleCommand) in cmd)
                {
                    OracleDataReader dr_temp = oracleCommand.ExecuteReader();

                    oracleDataReaders.Add(key, dr_temp.RecordsAffected > 0);
                }
                if (oracleDataReaders.Any(el => el.Value == false)) throw new Exception("Uma das queries não foi executada corretamente.");
                t.Commit();
            }
            catch (Exception ex)
            {
                t.Rollback();
                throw new Exception("Algum erro acontenceu na execução da query. " + ex.Message);
            }

            if ((cn != null) && cn.State == ConnectionState.Open)
            {
                cn.Close();
                cn.Dispose();
            }

            return oracleDataReaders;
        }
    }
}
