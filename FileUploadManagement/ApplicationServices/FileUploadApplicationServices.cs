using FileUploadManagement.DAO;
using FileUploadManagement.Models.HttpIn;
using FileUploadManagement.Models.HttpOut;
using Newtonsoft.Json;
using Oracle.ManagedDataAccess.Client;

namespace FileUploadManagement.ApplicationServices
{
    public interface IFileUploadApplicationServices
    {
        DataResponse Get_ListaReferenciasArquivo();
        DataResponse Post_ReferenciaArquivo(ArquivoArmazenado arquivo);
    }

    public class FileUploadApplicationServices : IFileUploadApplicationServices
    {
        private readonly IPersistenciaDB PersistenciaDB;

        public FileUploadApplicationServices(IPersistenciaDB persistenciaDB)
        {
            PersistenciaDB = persistenciaDB;
        }

        public DataResponse Get_ListaReferenciasArquivo()
        {
            var dt = PersistenciaDB.ExecuteDataQuery(GetArquivo());

            var result = JsonConvert.DeserializeObject<List<ArquivoArmazenado>>(JsonConvert.SerializeObject(dt));
            if (result == null) throw new Exception("A query não foi executada corretamente.");

            return DataResponse.ResultadoValido(result);
        }

        public DataResponse Post_ReferenciaArquivo(ArquivoArmazenado arquivo)
        {
            var dt = PersistenciaDB.ExecuteNoReturnQuery(PostArquivo(arquivo));

            if (dt == false) throw new Exception("A query não foi executada corretamente.");

            return DataResponse.ResultadoValidoNoContent();
        }

        private static QueryExecution GetArquivo()
        {
            #region QueryInformation e SQL

            var param = new List<OracleParameter> { };

            string sql = $@"
SELECT
    UPPER(SUBSTR(HEXTORAW(ARQ.GUID), 7, 2) || SUBSTR(HEXTORAW(ARQ.GUID), 5, 2) || 
    SUBSTR(HEXTORAW(ARQ.GUID), 3, 2) || SUBSTR(HEXTORAW(ARQ.GUID), 1, 2) ||
    SUBSTR(HEXTORAW(ARQ.GUID), 11, 2)|| SUBSTR(HEXTORAW(ARQ.GUID), 9, 2) ||
    SUBSTR(HEXTORAW(ARQ.GUID), 15, 2)|| SUBSTR(HEXTORAW(ARQ.GUID), 13, 2)||
    SUBSTR(HEXTORAW(ARQ.GUID), 17, 4)|| SUBSTR(HEXTORAW(ARQ.GUID), 21, 12)) AS GUID_ARQUIVO,
    ARQ.NOME AS NOME_ARQUIVO,
    ARQ.TIPO AS TIPO_ARQUIVO,
    ARQ.MIMO AS MIMO_ARQUIVO,
    ARQ.DATA_INSERCAO
FROM
    {DadosPersistencia.TabelaFiles} ARQ
";
            #endregion

            return QueryExecution.CreateQuery(sql, param);
        }
        private static QueryExecution PostArquivo(ArquivoArmazenado arquivo)
        {

            #region QueryInformation e SQL

            var vlGUID = new OracleParameter("GUID", OracleDbType.Raw, 16) { Value = arquivo.GUID_ARQUIVO };
            var vlNOME = new OracleParameter("NOME", OracleDbType.Varchar2, 200) { Value = arquivo.NOME_ARQUIVO };
            var vlTIPO = new OracleParameter("TIPO", OracleDbType.Varchar2, 200) { Value = arquivo.TIPO_ARQUIVO };
            var vlMIMO = new OracleParameter("MIMO", OracleDbType.Varchar2, 200) { Value = arquivo.MIMO_ARQUIVO };
            var vlDATA_INSERCAO = new OracleParameter("DATA_INSERCAO", OracleDbType.Date) { Value = DateTime.Now };
            var param = new OracleParameter[] {
                    vlGUID,
                    vlNOME,
                    vlTIPO,
                    vlMIMO,
                    vlDATA_INSERCAO
            };

            var sql = $@"
INSERT INTO {DadosPersistencia.TabelaFiles} (
    GUID,
    NOME,
    TIPO,
    MIMO,
    DATA_INSERCAO
)
VALUES(
    :GUID,
    :NOME,
    :TIPO,
    :MIMO,
    :DATA_INSERCAO
)";
            #endregion

            return QueryExecution.CreateQuery(sql, param);
        }
    }
}
