using FileUploadManagement.ApplicationServices;
using FileUploadManagement.DAO;
using FileUploadManagement.Models.HttpIn;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.CodeAnalysis;
using Microsoft.Net.Http.Headers;
using System.Net.Mime;

namespace FileUploadManagement.Controllers.Upload
{
    /// <summary>
    /// controller for upload large file
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class FileManagerController : ControllerBase
    {
        private readonly IFileUploadApplicationServices _FileUploadApplicationServices;

        public FileManagerController(IFileUploadApplicationServices fileUploadApplicationServices) {
            _FileUploadApplicationServices = fileUploadApplicationServices;
        }

        [HttpGet]
        [Route("GetUploadedList")]
        public IActionResult GetUploadedFile()
        {
            return Ok(_FileUploadApplicationServices.Get_ListaReferenciasArquivo().Data);
        }
        [HttpGet]
        [Route("GetUploadedFile/{fileName}")]
        public IActionResult GetUploadedFile([FromRoute] string fileName = "Area comum 2 (Pequeno)")
        {
            var request = HttpContext.Request;

            var imagePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Services", "Files");

            string stringsFile = Directory.GetFiles(imagePath).First(el => el.Contains(fileName));
            string mime = MimeMapping.MimeUtility.GetMimeMapping(stringsFile);

            return PhysicalFile(stringsFile, mime);
        }

        /// <summary>
        /// Action for upload large file
        /// </summary>
        /// <remarks>
        /// Request to this action will not trigger any model binding or model validation,
        /// because this is a no-argument action
        /// </remarks>
        /// <returns></returns>
        [HttpPost]
        [Route(nameof(UploadLargeFile))]
        public async Task<IActionResult> UploadLargeFile()
        {
            var request = HttpContext.Request;

            // validation of Content-Type
            // 1. first, it must be a form-data request
            // 2. a boundary should be found in the Content-Type
            if (!request.HasFormContentType ||
                !MediaTypeHeaderValue.TryParse(request.ContentType, out var mediaTypeHeader) || 
                string.IsNullOrEmpty(mediaTypeHeader.Boundary.Value)) {
                return new UnsupportedMediaTypeResult();
            }

            var boundary = HeaderUtilities.RemoveQuotes(mediaTypeHeader.Boundary.Value).Value;
            var reader = new MultipartReader(boundary, request.Body);
            var section = await reader.ReadNextSectionAsync();

            // This sample try to get the first file from request and save it
            // Make changes according to your needs in actual use
            while (section != null)
            {
                var hasContentDispositionHeader = ContentDispositionHeaderValue.TryParse(section.ContentDisposition,
                    out var contentDisposition);

                if (hasContentDispositionHeader && 
                    contentDisposition!.DispositionType.Equals("form-data") &&
                    !string.IsNullOrEmpty(contentDisposition.FileName.Value))
                {

                    Guid guid = Guid.NewGuid();
                    string nomeArquivo = contentDisposition.FileName.Value;
                    string tipoArquivo = contentDisposition.FileName.Value.Split(".")[1];
                    string mimoArquivo = MimeMapping.MimeUtility.GetMimeMapping(contentDisposition.FileName.Value);

                    _FileUploadApplicationServices.Post_ReferenciaArquivo(new ArquivoArmazenado()
                    {
                        GUID_ARQUIVO = guid,
                        NOME_ARQUIVO = nomeArquivo,
                        TIPO_ARQUIVO = tipoArquivo,
                        MIMO_ARQUIVO = mimoArquivo
                    });

                    // Don't trust any file name, file extension, and file data from the request unless you trust them completely
                    // Otherwise, it is very likely to cause problems such as virus uploading, disk filling, etc
                    // In short, it is necessary to restrict and verify the upload
                    // Here, we just use the temporary folder and a random file name

                    // Get the temporary folder, and combine a random file name with it
                    //var fileName = Path.GetRandomFileName();
                    var dirPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Services", "Files");
                    var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Services", "Files", guid.ToString() + "." + tipoArquivo);
                    Directory.CreateDirectory(dirPath);

                    using (var targetStream = System.IO.File.Create(filePath))
                    {
                        await section.Body.CopyToAsync(targetStream);
                    }

                }
                section = await reader.ReadNextSectionAsync();
            }
            return Ok();
        }
    }
}
