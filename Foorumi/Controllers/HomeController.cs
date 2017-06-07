using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Foorumi.Models;

namespace Foorumi.Controllers
{
    public class HomeController : Controller
    {
        private static readonly IList<Discussion> _discussions;

        static HomeController()
        {
            _discussions = new List<Discussion>
            {
                new Discussion
                {
                    Id = 1,
                    Author = "Daniel Lo Nigro",
                    Topic = "Aihe",
                    Text = "Hello ReactJS.NET World!",
                    replies = new List<Comment>()
                    
                },
                new Discussion
                {
                    Id = 2,
                    Author = "Pete Hunt",
                    Topic = "Aihe",
                    Text = "This is one comment",
                    replies = new List<Comment>()

                },
                   
                new Discussion
                {
                    Id = 3,
                    Author = "Jordan Walke",
                    Topic = "Aihe",
                    Text = "This is *another* comment",
                    replies = new List<Comment>()

                },
            };
        }

        public ActionResult Index()
        {
            return View();
        }

        [Route("discussions")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Comments()
        {
            return Json(_discussions);
        }

        [Route("discussions/new")]
        [HttpPost]
        public ActionResult AddDiscussion(Discussion comment)
        {
            // Create a fake ID for this comment
            comment.Id = _discussions.Count + 1;
            _discussions.Add(comment);
            _discussions[comment.Id-1].replies = new List<Comment>();
            return Content("Success :)");
        }

        [Route("reply/{id?}")]
        [HttpPost]
        public ActionResult AddReply(Comment reply, int id)
        {
            reply.Id = _discussions[id - 1].replies.Count + 1;
            _discussions[id-1].replies.Add(reply);
            return Content("Success :");
        }

        

    }

}

