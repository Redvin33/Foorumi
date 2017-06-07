using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Foorumi.Models;


namespace WebApplication1.Controllers
{
    public class DiscussionController : Controller
    {
        public ActionResult discussion()
        {
            return View();
        }

    }

}

