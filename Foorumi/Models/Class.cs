using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Foorumi.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Author { get; set; }
        public string Text { get; set; }
    }

    public class Discussion
    {
        public int Id { get; set; }
        public string Author { get; set; }
        public string Topic { get; set; }
        public string Text { get; set; }
        public List<Comment> replies { get; set; }
    }
}
