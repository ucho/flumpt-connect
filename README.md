flumpt-connect
==============
Connect function for [mizchi/flumpt](https://github.com/mizchi/flumpt)

[![Build Status](https://travis-ci.org/ucho/flumpt-connect.svg?branch=master)](https://travis-ci.org/ucho/flumpt-connect)
[![npm version](https://badge.fury.io/js/flumpt-connect.svg)](https://badge.fury.io/js/flumpt-connect)

Installation
------------

```
$ npm install --save flumpt-connect
```

Example
-------

```js
import React from 'react';
import connect from 'flumpt-connect';

const MyComponent = ({ count, increment }) => (
  <div>
    {count}
    <button onClick={increment}>increment</button>
  </div>
);

export default connect(
  ({ count }) => ({ count }),
  { increment: 'increment' }
)(MyComponent);
```

API
------

### `connect([mapStateToProps], [mapDispatchToProps])`

Connects a React component to a Flumpt state. This function is referred to [react-redux](https://github.com/reactjs/react-redux)'s same name.

#### Arguments

* [`mapStateToProps(state): stateProps`] \(*Function*): It specifies a function that accepts the state of flumpt and returns Object. The result is passed as a props to the Component. If null or undefined is passed, no props is passed from the state.

* [`mapDispatchToProps(dispatch): dispatchProps`] \(*Object or Function*):
  * Object case: Its key is used as a key of props, and the paired value is used as an event name for EventEmitter. The new component receives a props: the key is as it is, and the paired value is a function that calls the dispatch function with the specieifed event name.
  * Function case: The specified function accepts the dispatch function of flumpt and returns Object. The result is passed as a props to the new component.
  * Not spefied case: If null or undefined is passed, the dispatch function is passed to the new component as it is.

LICENSE
-------
MIT
