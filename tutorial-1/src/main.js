var React = require('react');
var Marked = require('marked');
var $ = require('jquery');

var Comment = React.createClass({
  rawMarkup: function () {
    var rawMarkup = Marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },
  handleDestroy: function () {
    this.props.onCommentDestroy(this.props.id)
  },
  render: function () {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
            {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
        <span>{this.props.id}</span>
            <button onClick={this.handleDestroy}>Remove</button>
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function () {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment key={comment.id}
                 id={comment.id}
                 author={comment.author}
                 onCommentDestroy={this.props.onCommentDestroy} >
          {comment.text}
        </Comment>
      )
    }.bind(this));
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function (e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  },
  render: function () {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something" ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var CommentBox = React.createClass({
  getInitialState: function () {
    return {data:  []};
  },

  loadCommentsFromServer: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, error) {
        console.error(this.props.url, status, error.toString());
      }.bind(this)
    });
  },

  handleCommentSubmit: function (comment) {
    var comments = this.state.data;
    comment.id = ~~(new Date()) + ''
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function (data) {
        this.setState({data: data});
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.url, status, error.toString());
      }.bind(this)
    });
  },

  handleCommentDestroy: function (id) {
    var comments = this.state.data;
    console.log("Deleting comment with id: ", id);
    var newComments = comments.filter(function (com) {
      return com.id !== id
    });
      var bob = {id: id};
      console.log(bob);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'DELETE',
      data: bob,
      success: function (data) {
        this.setState({data: data});
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.url, status, error.toString());
      }.bind(this)
    });
  },

  componentDidMount: function () {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },

  render: function () {
    return (
      <div className="commentBox">
      <h1>Comments</h1>
      <CommentList data={this.state.data} onCommentDestroy={this.handleCommentDestroy} />
      <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

React.render(
  <CommentBox url="comments.json" pollInterval={10000}/>,
  document.getElementById('content')
);
