var React = require('react');

var CommentList = React.createClass({
  render: function () {
    return (
      <div className="commentBox">
      Hello, world! I am a comment list
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
