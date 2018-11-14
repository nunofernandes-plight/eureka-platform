import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import {Web3Context} from './Web3Context';

export default function withWeb3(Component) {
  class ComponentWithWeb3 extends React.Component {
    render() {
      return (
        <Web3Context.Consumer>
          {web3Context => {
            const context = web3Context;
            return (
              <Component
                {...this.props}
                context={context}
                ref={this.props.onRef}
              />
            );
          }}
        </Web3Context.Consumer>
      );
    }
  }
  return hoistStatics(ComponentWithWeb3, Component);
}
   