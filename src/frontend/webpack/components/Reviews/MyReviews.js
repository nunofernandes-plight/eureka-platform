import React, {Fragment} from 'react';
import styled from 'styled-components';
import {Card} from '../../views/Card.js';
import {Table} from '../../design-components/Table/Table.js';
import {getDomain} from '../../../../helpers/getDomain.js';
import {getRandomAvatar} from '../../../helpers/getRandomAvatar.mjs';
import Roles from '../../../../backend/schema/roles-enum.mjs';

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

class MyReviews extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    console.log(this.props.user);
  }

  becomeReviewer() {
    this.setState({loading: true});
    fetch(`${getDomain()}/api/users/becomeReviewer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ethereumAddress: this.props.user.ethereumAddress})
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
        } else {
          this.setState({
            errorMessage: response.error,
            loading: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          errorMessage: 'Ouh. Something went wrong.',
          loading: false
        });
      });
  }

  render() {
    const IsReviewer = () => {
      return (
        <Box>
          <i>
            {' '}
            Congratulations! You are a reviewer for EUREKA. If want want to
            start reviewing your first article, <a href={''}>click here. </a>
          </i>
        </Box>
      );
    };

    const IsNotReviewer = () => {
      return (
        <Box>
          <i>
            It seems like you are not a reviewer yet. If you want to start
            reviewing your first article, click the button below
          </i>
          <button
            onClick={() => {
              this.becomeReviewer();
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
          {this.props.user.roles.includes(Roles.REVIEWER) ? (
            <IsReviewer />
          ) : (
            <IsNotReviewer />
          )}
        </Card>
      </Container>
    );
  }
}

export default MyReviews;
