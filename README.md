flumpt-connect
==============
Connect function for flumpt

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

* [`mapStateToProps(state): stateProps`] \(*Function*): It specifies a function that accepts the state of flumpt and returns Object. The result is passed as a props to the Component. If null or undefined is passed, the state is passed as is to the component.

LICENSE
-------
MIT
