var React = require('react');
var Marked = require('marked');

var Comment = React.createClass({
  render: function () {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        {this.props.children}
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function () {
    return (
      <div className="commentList">
        <Comment author="Pete Hunt">This is a comment</Comment>
        <Comment author="Jordan Walke">Thir is *another* comment</Comment>
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
  render: function () {
    return (
      <div className="commentBox">
      <h1>Comments</h1>
      <CommentList />
      <CommentForm />
      </div>
    );
  }
});

React.render(
  <CommentBox />,
  document.getElementById('content')
);
