import React from 'react';
import Lottie from 'react-lottie';
import * as animationData from './email.json';

class SendEmailAnimation extends React.Component {
  render() {
    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      }
    };

    return (
      <div>
        <Lottie
          options={defaultOptions}
          height={700}
          width={700}
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

export default SendEmailAnimation;
