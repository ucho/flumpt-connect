import React from 'react';
import { Component } from 'flumpt';
import hoistStatics from 'hoist-non-react-statics';

function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}

export function connect(mapStateToProps) {
  const mapToPropsFunc = mapStateToProps || ((state) => state);

  return function connectHOC(WrappedComponent) {
    class Connect extends Component {
      constructor(props) {
        super(props);
        this.dispatch = this.dispatch.bind(this);
      }
      render() {
        const stateProps = mapToPropsFunc(this.context.emitter.state);
        const extraProps = { dispatch: this.dispatch };
        return React.createElement(
          WrappedComponent,
          { ...this.props, ...stateProps, ...extraProps }
        );
      }
    }

    Connect.displayName = `Connect(${getDisplayName(WrappedComponent)})`;
    Connect.WrappedComponent = WrappedComponent;

    return hoistStatics(Connect, WrappedComponent);
  };
}

export default connect;