import React from 'react';
import _ from 'lodash';

let Form = React.createClass({
  propTypes: {
    onUserInput: React.PropTypes.func.isRequired,
    term: React.PropTypes.string.isRequired,
    facets: React.PropTypes.object.isRequired
  },
  search(e) {
    e.preventDefault();
    let updatedFacets = _.transform(this.props.facets, (result, value, name)=> {
      result[name] = this.refs[name].getDOMNode().checked;
    });
    this.props.onUserInput(this.refs.term.getDOMNode().value, updatedFacets);
  },
  render() {
    let facetToggles = _.transform(this.props.facets, function (result, value, name) {
      result.push(<li key={name}><label><input ref={name} type='checkbox'/> {name}</label></li>);
    }, []);
    return (
      <form onSubmit={this.search}>
        <fieldset>
          <legend>Search</legend>
          <input ref='term' id='Term' name='term' type='search' autoFocus required />
          <input className='button' type='submit' value='Search' />
        </fieldset>
        <fieldset>
          <legend>Facets</legend>
          <ul>
            {facetToggles}
          </ul>
        </fieldset>
      </form>
    );
  }
});

export default Form;
