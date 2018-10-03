import React from 'react';
import Lottie from 'react-lottie';
import * as animationData from './email.json';

class SendEmailAnimation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return (
      <div>
        <Lottie
          options={defaultOptions}
          height={400}
          width={400}
          eventListeners={[
            {
              eventName: 'complete',
              callback: () => console.log('the animation completed')
            }
          ]}
        />
      </div>
    );
  }
}

export default SendEmailAnimation;
