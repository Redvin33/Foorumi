var url = location.pathname;
var array = url.split('/');
var last = array[array.length - 1];

var Reply = React.createClass({
    rawMarkup: function () {
        var md = new Remarkable();
        var rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
    },

    render: function () {
        var md = new Remarkable();
        return (
            <div className="Reply">
                <h2 className="ReplyAuthor">
                    {this.props.author}
                </h2>
                
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    }
});


var ReplyList = React.createClass({
    render: function () {
        var ReplyNodes = this.props.replies.map(function (reply) {
            return (
                <Reply author={reply.author} key={reply.id} class="well msg">
                    {reply.text}
                </Reply>
            );
        });
        return (
            <div className="ReplyList">
                {ReplyNodes}
            </div>
        );

    }
});

var ReplyForm = React.createClass({
    getInitialState: function () {
        return { author: '', text: '' };
    },

    handleAuthorChange: function (e) {
        this.setState({ author: e.target.value });
    },
    
    handleTextChange: function (e) {
        this.setState({ text: e.target.value });
    },

    handleSubmit: function (e) {
        e.preventDefault();
        var author = this.state.author.trim();
        
        var text = this.state.text.trim();
        if (!author  || !text) {
            return;
        }
        this.props.onReplySubmit({ author: author, text: text });
        this.setState({ author: '', text: '' });
    },

    render: function () {
        return (
            <form className="ReplyForm" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={this.state.author}
                    onChange={this.handleAuthorChange}
                />
                
                <input
                    type="text"
                    placeholder="Say something..."
                    value={this.state.text}
                    onChange={this.handleTextChange}
                />
                <input type="submit" value="Post" />
            </form>
        );
    }
});


var OriginalPost = React.createClass({
    loadStartPostFromServer: function () {
        var xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url, true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            var discussion = data[this.state.id-1];
            var mesg = discussion["text"];
            var author = discussion["author"];
            var topic = discussion["topic"];
            var replies = discussion["replies"];
            this.setState({ msg: mesg, author: author, topic: topic, replies: replies });
        }.bind(this);
        xhr.send();
       
    },

    submitReply: function (reply) {
        var data = new FormData();
        data.append('author', reply.author);
        data.append('text', reply.text);
        
        var xhr = new XMLHttpRequest();
        xhr.open('post', this.props.submitUrl +"?id="+ this.state.id, true);
        xhr.onload = function () {
            this.loadStartPostFromServer();
        }.bind(this);
        xhr.send(data);

    },

    getInitialState: function () {
        return { id: '', msg: '', author: '', topic: '', replies: []};
    },


    componentDidMount: function () {
        this.setState({ id: last });
        this.loadStartPostFromServer();
    },

    render: function () {
        return (<div>
            <h1>{this.state.topic}</h1>
            <p>{this.state.msg}{last}</p>
            
            <ReplyList replies={this.state.replies}/>
            <ReplyForm onReplySubmit={this.submitReply}/>
        </div>);
    }
});



ReactDOM.render(<OriginalPost url="/discussions" submitUrl="/reply/" />,
    document.getElementById('content')
);

