var Ballot = React.createClass({
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
        <div>
          <input className='input' value={text} name="answers" onChange={this.onChange}></input>
          <br />
        </div>
      )
    };
    return (
      <div>

        <form  method="POST" action="/">
          <textarea name="question" onChange={this.onChangeQuestion} value={this.state.question}></textarea>
          <br />
          {this.state.answers.map(createAnswer)}
          <br />
          <input className='input' onChange={this.onChange} value={this.state.value}></input>
          <br />
          <button className='button' onClick={this.handleSubmit}>Add another answer</button>
          <br />
          <input type='submit' className='button'></input>
        </form>
        <br />
      </div>
    )
  }
});

React.render(<Ballot />, document.getElementById('ballot'));