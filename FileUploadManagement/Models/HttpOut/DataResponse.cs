
namespace FileUploadManagement.Models.HttpOut
{
    public class DataResponse
    {
        public bool Error { get; set; } = false;
        public string ErrorMessage { get; set; } = string.Empty;
        public int ResponseCode { get; set; } = 200;
        public object? Data { get; set; }

        DataResponse()
        {
            this.ResponseCode = 204;
        }
        DataResponse(object? Data)
        {
            this.Data = Data;
        }
        DataResponse(int RespCode, string Message)
        {
            this.Error = true;
            this.ErrorMessage = Message;
            this.ResponseCode = RespCode;
        }
        public static DataResponse ResultadoValido(object? Data) => new(Data);
        public static DataResponse ResultadoValidoNoContent() => new();
        public static DataResponse ResultadoInvalido(int ResponseCode, string ErrorMessage) => new(ResponseCode, ErrorMessage);
    }

}

