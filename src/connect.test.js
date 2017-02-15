import test from 'ava';
import React from 'react';
import { Flux } from 'flumpt';
import { render } from 'enzyme';
import connect from './connect';

test('Connected component', (t) => {
  const mapStateToProps = ({ passed, omitted }) => ({ passed }); // eslint-disable-line no-unused-vars
  const Original = ({ passed, omitted, dispatch }) => { // eslint-disable-line react/prop-types
    t.is(passed, 'passed');
    t.falsy(omitted);
    t.is(typeof dispatch, 'function');
    dispatch('call');
    return <div />;
  };
  const Connected = connect(mapStateToProps)(Original);

  t.is(Connected.WrappedComponent, Original);
  t.is(Connected.displayName, 'Connect(Original)');

  let called = false;

  class TestApp extends Flux {
    subscribe() {
      this.on('call', () => {
        called = true;
      });
    }
    render() {
      return <Connected />;
    }
  }

  const app = new TestApp({
    renderer: (el) => render(el),
    initialState: {
      passed: 'passed',
      omitted: 'omitted',
    },
  });
  app.update((state) => state);

  t.true(called);
});
