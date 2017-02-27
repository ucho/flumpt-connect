import test from 'ava';
import React from 'react';
import { Flux } from 'flumpt';
import { render } from 'enzyme';
import connect from './connect';

/* eslint-disable react/prop-types */

test('Connected component has modified properties', (t) => {
  class OriginalClass extends React.Component {
    render() {
      return <div />;
    }
  }
  const ConnectedClass = connect()(OriginalClass);

  t.is(ConnectedClass.WrappedComponent, OriginalClass);
  t.is(ConnectedClass.displayName, 'Connect(OriginalClass)');

  const OriginalFunc = () => <div />;
  const ConnectedFunc = connect()(OriginalFunc);

  t.is(ConnectedFunc.WrappedComponent, OriginalFunc);
  t.is(ConnectedFunc.displayName, 'Connect(OriginalFunc)');
});

test('Connected component receives props modified by mapStateToProps', (t) => {
  let rendered = false;

  const mapStateToProps = ({ passed, omitted }) => ({ passed }); // eslint-disable-line no-unused-vars
  const Original = ({ passed, omitted }) => {
    rendered = true;
    t.is(passed, 'passed');
    t.falsy(omitted);
    return <div />;
  };
  const Connected = connect(mapStateToProps)(Original);

  class TestApp extends Flux {
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

  t.true(rendered);
});

test('Connected component can call dispatch', (t) => {
  const Original = ({ dispatch }) => {
    t.is(typeof dispatch, 'function');
    dispatch('call');
    return <div />;
  };
  const Connected = connect()(Original);

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
    initialState: {},
  });

  app.update((state) => state);

  t.true(called);
});

test('Connected component receives no props from state if no mapStateToProps is given', (t) => {
  let rendered = false;

  const Original = (props) => {
    rendered = true;
    t.is(typeof props.dispatch, 'function');
    const expected = { dispatch: props.dispatch };
    t.deepEqual(props, expected);
    return <div />;
  };
  const Connected = connect()(Original);

  class TestApp extends Flux {
    render() {
      return <Connected />;
    }
  }

  const app = new TestApp({
    renderer: (el) => render(el),
    initialState: { a: 1, b: 2 },
  });

  app.update((state) => state);

  t.true(rendered);
});

test('Connected component receives merged props', (t) => {
  const givenProps = { a: 'props', b: 'props', dispatch: 'props' };
  const givenState = { b: 'state', dispatch: 'state' };
  let rendered = false;

  const Original = ({ a, b, dispatch }) => {
    rendered = true;
    t.is(a, 'props');
    t.is(b, 'state');
    t.is(typeof dispatch, 'function');
    return <div />;
  };
  const Connected = connect((state) => state)(Original);

  class TestApp extends Flux {
    render() {
      return <Connected { ...givenProps } />;
    }
  }

  const app = new TestApp({
    renderer: (el) => render(el),
    initialState: givenState,
  });

  app.update((state) => state);

  t.true(rendered);
});
