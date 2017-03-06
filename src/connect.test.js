import test from 'ava';
import React from 'react';
import { Flux } from 'flumpt';
import { render } from 'enzyme';
import connect from './connect';

/* eslint-disable react/prop-types */

test('properties', (t) => {
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

const CALL = CALL;

function doTest({
  t,
  Original,
  initialState,
  mapStateToProps,
  mapDispatchToProps,
  ownProps,
  func = () => {}
}) {
  const Connected = connect(mapStateToProps, mapDispatchToProps)(Original);

  let called = false;

  class TestApp extends Flux {
    subscribe() {
      this.on(CALL, (...args) => {
        called = true;
        func(...args);
      });
    }
    render() {
      return <Connected { ...ownProps } />;
    }
  }

  const app = new TestApp({
    renderer: (el) => render(el),
    initialState
  });

  app.update((state) => state);

  t.true(called);
}

test('no params: receives only dispatch', (t) => {
  const Original = (props) => {
    t.is(typeof props.dispatch, 'function');
    props.dispatch(CALL);
    const expected = { dispatch: props.dispatch };
    t.deepEqual(props, expected);
    return <div />;
  };
  doTest({ t, Original });
});

test('give mapStateToProps: receives mapped state and dispatch', (t) => {
  const initialState = {
    passed: 'passed',
    omitted: 'omitted'
  };
  const mapStateToProps = ({ passed, omitted }) => ({ passed }); // eslint-disable-line no-unused-vars
  const Original = (props) => {
    t.is(props.passed, 'passed');
    t.falsy(props.omitted);
    t.is(typeof props.dispatch, 'function');
    props.dispatch(CALL);
    return <div />;
  };
  doTest({ t, initialState, mapStateToProps, Original });
});

test('give a function to mapDispatchToProps: receives no state, dispatch props and no dispatch', (t) => {
  const initialState = { omitted: 'omitted' };
  const mapDispatchToProps = (dispatch) => ({ setMessage: (msg) => dispatch(CALL, msg) });

  let message = '';
  const func = (msg) => {
    message = msg;
  }
  const expectedMessage = 'hoge';

  const Original = (props) => {
    t.falsy(props.omitted);
    t.is(typeof props.setMessage, 'function');
    props.setMessage(expectedMessage);
    t.falsy(props.dispatch);
    return <div />;
  };

  doTest({ t, initialState, mapDispatchToProps, Original, func });

  t.is(message, expectedMessage);
});

test('give a object to mapDispatchToProps: receives no state, dispatch props and no dispatch', (t) => {
  const initialState = { omitted: 'omitted' };
  const mapDispatchToProps = { setMessage: CALL }

  let message = '';
  const func = (msg) => {
    message = msg;
  }
  const expectedMessage = 'hoge';

  const Original = (props) => {
    t.falsy(props.omitted);
    t.is(typeof props.setMessage, 'function');
    props.setMessage(expectedMessage);
    t.falsy(props.dispatch);
    return <div />;
  };

  doTest({ t, initialState, mapDispatchToProps, Original, func });

  t.is(message, expectedMessage);
});

test('give an unexpected value to mapDispatchToProps: Error is thrown', (t) => {
  t.throws(() => connect(null, 1));
});

test('give mapStateToProps and mapDispatchToProps: receives merged props', (t) => {
  const ownProps = { a: 'props', b: 'props', c: 'props' };
  const initialState = { b: 'state', c: 'state' };
  const mapStateToProps = (state) => state;
  const mapDispatchToProps = (dispatch) => ({ c: dispatch });
  const Original = ({ a, b, c }) => {
    t.is(a, 'props');
    t.is(b, 'state');
    t.is(typeof c, 'function');
    c(CALL);
    return <div />;
  };
  doTest({ t, ownProps, initialState, mapStateToProps, mapDispatchToProps, Original });
});
