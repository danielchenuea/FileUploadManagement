using Newtonsoft.Json;

namespace FileUploadManagement.Models.HttpIn;

public class ArquivoArmazenado
{
    [JsonProperty("GUID_ARQUIVO")]
    public Guid GUID_ARQUIVO { get; set; }
    [JsonProperty("NOME_ARQUIVO")]
    public string NOME_ARQUIVO { get; set; } = string.Empty;
    [JsonProperty("TIPO_ARQUIVO")]
    public string TIPO_ARQUIVO { get; set; } = string.Empty;
    [JsonProperty("MIMO_ARQUIVO")]
    public string MIMO_ARQUIVO { get; set; } = string.Empty;
    [JsonProperty("DATA_INSERCAO")]
    public DateTime DATA_INSERCAO { get; set; }
}

