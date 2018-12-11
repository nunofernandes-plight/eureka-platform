import React from 'react';
import styled from 'styled-components';
import {Card} from '../../views/Card.js';
import connect from 'react-redux/es/connect/connect.js';
import {fetchUserData} from '../../reducers/user.js';
import {becomeAReviewer} from '../../reducers/reviewer.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Box = styled.div`
  margin-top: 1.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

class BecomeReviewer extends React.Component {
  render() {
    const IsNotReviewer = () => {
      return (
        <Box>
          <i>
            It seems like you are not a reviewer yet. If you want to start
            reviewing your first article, click the button below
          </i>
          <button
            onClick={async () => {
              await this.props.becomeAReviewer();
              await this.props.fetchUserData();
            }}
          >
            Become a reviewer
          </button>
        </Box>
      );
    };

    return (
      <Container>
        <Card width={1000} title={'My Reviews'}>
          <IsNotReviewer />
        </Card>
      </Container>
    );
  }
}

export default connect(
  state => ({
    user: state.userData.data
  }),
  dispatch => ({
    fetchUserData: () => {
      dispatch(fetchUserData());
    },
    becomeAReviewer: () => {
      dispatch(becomeAReviewer());
    }
  })
)(BecomeReviewer);
