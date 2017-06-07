var Discussion = React.createClass({
    rawMarkup: function () {
        var md = new Remarkable();
        var rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
    },

    render: function () {
        var md = new Remarkable();
        return (
            <div className="Discussion">
                <h2 className="DiscussionAuthor">
                    {this.props.author}
                </h2>
                <h2>
                    {this.props.topic}
                </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    }
});

var DiscussionList = React.createClass({
    render: function () {
        var DiscussionNodes = this.props.data.map(function (discussion) {
            return (
                
                <a href={"/topic/" + discussion.id} >
                    <Discussion author={discussion.author} key={discussion.id} topic={discussion.topic}>
                        {discussion.text}
                    </Discussion>
                </a>
            )
        });
        return (
            <div className="DiscussionList">
                {DiscussionNodes}
            </div>
        );
    }
});

var DiscussionForm = React.createClass({
    getInitialState: function () {
        return { author: '', topic: '' , text: '', };
    },

    handleAuthorChange: function (e) {
        this.setState({ author: e.target.value });
    },
    handleTopicChange: function (e) {
        this.setState({ topic: e.target.value });
    },
    handleTextChange: function (e) {
        this.setState({ text: e.target.value });
    },

    handleSubmit: function (e) {
        e.preventDefault();
        var author = this.state.author.trim();
        var topic = this.state.topic.trim();
        var text = this.state.text.trim();
        if (!author || !topic || !text) {
            return;
        }
        this.props.onDiscussionSubmit({author: author, topic: topic, text: text});
        this.setState({author: '', topic: '', text: ''});
    },

    render: function () {
        return (
            <form className="DiscussionForm" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={this.state.author}
                    onChange={this.handleAuthorChange}
                />
                <input
                    type="text"
                    placeholder="topic"
                    value={this.state.topic}
                    onChange={this.handleTopicChange}
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




var DiscussionBox = React.createClass({
    loadDiscussionsFromServer: function () {
        var xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url, true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ data: data });
        }.bind(this);
        xhr.send();
    },

    getInitialState: function () {
        return { data: [] };
    },

    handleDiscussionSubmit: function (Discussion) {
        var data = new FormData();
        data.append('author', Discussion.author);
        data.append('topic', Discussion.topic);
        data.append('text', Discussion.text);
        //data.append('replies', []);

        var xhr = new XMLHttpRequest();
        xhr.open('post', this.props.submitUrl, true);
        xhr.onload = function () {
            this.loadDiscussionsFromServer();
        }.bind(this);
        xhr.send(data);
    },

    componentDidMount: function () {
        this.loadDiscussionsFromServer();
        window.setInterval(this.loadDiscussionsFromServer, this.props.Interval);
    },

    render: function () {
        return (
            <div className="DiscussionBox">
                <h1>Discussions</h1>
                <DiscussionList data={this.state.data} />
                <DiscussionForm onDiscussionSubmit={this.handleDiscussionSubmit} />
            </div>
        );
    }
});

ReactDOM.render(
    <DiscussionBox url="discussions" submitUrl="discussions/new" Interval={2000}/>,
    document.getElementById('content')
);