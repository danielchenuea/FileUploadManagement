
using Microsoft.AspNetCore.Mvc;

namespace FileUploadManagement.Controllers
{
    public class ErrorPageController : Controller
    {
        public IActionResult Index()
        {
            return View("NotFound");
        }
    }
}
