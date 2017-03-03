import React from 'react';
import { Component } from 'flumpt';
import hoistStatics from 'hoist-non-react-statics';

function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}

export function connect(mapStateToProps, mapDispatchToProps) {
  const mapStateToPropsFunc = mapStateToProps || (() => ({}));
  const mapDispatchToPropsFunc = mapDispatchToProps || ((dispatch) => ({ dispatch }));

  return function connectHOC(WrappedComponent) {
    class Connect extends Component {
      constructor(props) {
        super(props);
        this.dispatch = this.dispatch.bind(this);
      }
      render() {
        const stateProps = mapStateToPropsFunc(this.context.emitter.state);
        const dispatchProps = mapDispatchToPropsFunc(this.dispatch);
        return React.createElement(
          WrappedComponent,
          { ...this.props, ...stateProps, ...dispatchProps }
        );
      }
    }

    Connect.displayName = `Connect(${getDisplayName(WrappedComponent)})`;
    Connect.WrappedComponent = WrappedComponent;

    return hoistStatics(Connect, WrappedComponent);
  };
}

export default connect;
