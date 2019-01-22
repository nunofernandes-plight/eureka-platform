import React from 'react';
import Lottie from 'react-lottie';

class LottieManager extends React.Component {
  render() {
    const defaultOptions = {
      loop: this.props.loop,
      autoplay: true,
      animationData: this.props.animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return (
      <div>
        <Lottie
          options={defaultOptions}
          height={this.props.height}
          width={this.props.width}
          isPaused={this.props.isPaused}
          margin={-24}
          eventListeners={[
            {
              eventName: 'complete',
              callback: () => {
                this.props.onComplete();
              }
            }
          ]}
        />
      </div>
    );
  }
}

export default LottieManager;
