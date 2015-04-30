var React = require('react');
var Marked = require('marked');
var $ = require('jquery');

var data = [
  {author: "Pete Hunt", text: "This is one comment", id: 1},
  {author: "Jordan Walke", text: "This is *another* comment", id: 2}
];

var Comment = React.createClass({
  render: function () {
    var rawMarkup = Marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function () {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment key={comment.id} author={comment.author}>
          {comment.text}
        </Comment>
      )
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  render: function () {
    return (
      <div className="commentBox">
        Hello, world! I am a comment form
      </div>
    );
  }
});

var CommentBox = React.createClass({
  getInitialState: function() {
    return {data:  []};
  },
  loadCommentsFromServer: function() {
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
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function () {
    return (
      <div className="commentBox">
      <h1>Comments</h1>
      <CommentList data={this.state.data} />
      <CommentForm />
      </div>
    );
  }
});

React.render(
  <CommentBox url="comments.json" pollInterval={2000}/>,
  document.getElementById('content')
);
