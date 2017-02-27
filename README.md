flumpt-connect
==============
Connect function for [mizchi/flumpt](https://github.com/mizchi/flumpt)

[![Build Status](https://travis-ci.org/ucho/flumpt-connect.svg?branch=master)](https://travis-ci.org/ucho/flumpt-connect)
[![npm version](https://badge.fury.io/js/flumpt-connect.svg)](https://badge.fury.io/js/flumpt-connect)

Installation
------------

required: react >= 0.14 and flumpt

```
$ npm install --save flumpt-connect
```

Example
-------

```js
import React from 'react';
import connect from 'flumpt-connect';

const MyComponent = ({ count, dispatch }) => (
  <div>
    {count}
    <button onClick={() => dispatch('increment')}>increment</button>
  </div>
);

export default connect(({ count }) => ({ count }))(MyComponent);
```

API
------

### `connect([mapStateToProps])`

Connects a React component to a Flumpt state. This function is referred to [react-redux](https://github.com/reactjs/react-redux)'s same name. Connected component receives the `dispatch` function of flumpt as a props.

#### Arguments

* [`mapStateToProps(state): stateProps`] \(*Function*): It specifies a function that accepts the state of flumpt and returns Object. The result is passed as a props to the Component. If null or undefined is passed, no props is passed from the state.

LICENSE
-------
MIT
