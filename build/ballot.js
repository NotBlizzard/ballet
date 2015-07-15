var Ballot = React.createClass({displayName: "Ballot",
  getInitialState: function() {
    return {answers: [], value: '', question: ''};
  },

  handleSubmit: function(e) {
    e.preventDefault();
    if (this.state.value === '') {
      return alert("Can't be blank.");
    }
    var items = this.state.answers.concat([this.state.value]);
    this.setState({answers: items, value: ''});
  },
  onChange: function(e) {
    this.setState({value: e.target.value});
  },

  onChangeQuestion: function(e) {
    this.setState({question: e.target.value});
  },
  render: function() {
    var createAnswer = function(text) {
      return (
        React.createElement("div", null, 
          React.createElement("input", {className: "input", value: text, name: "answers", onChange: this.onChange}), 
          React.createElement("br", null)
        )
      )
    };
    return (
      React.createElement("div", null, 

        React.createElement("form", {method: "POST", action: "/"}, 
          React.createElement("textarea", {name: "question", onChange: this.onChangeQuestion, value: this.state.question}), 
          React.createElement("br", null), 
          this.state.answers.map(createAnswer), 
          React.createElement("br", null), 
          React.createElement("input", {className: "input", onChange: this.onChange, value: this.state.value}), 
          React.createElement("br", null), 
          React.createElement("button", {className: "button", onClick: this.handleSubmit}, "Add another answer"), 
          React.createElement("br", null), 
          React.createElement("input", {type: "submit", className: "button"})
        ), 
        React.createElement("br", null)
      )
    )
  }
});

React.render(React.createElement(Ballot, null), document.getElementById('ballot'));