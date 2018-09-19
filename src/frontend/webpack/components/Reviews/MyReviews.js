import React from 'react';
import styled from 'styled-components';
import {Card} from '../../views/Card.js';
import {Table} from '../../design-components/Table/Table.js';
import {getDomain} from '../../../../helpers/getDomain.js';
import {getRandomAvatar} from '../../../helpers/getRandomAvatar.js';
import Roles from '../../../../backend/schema/roles-enum.mjs';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SContainer = styled.div`
  font-weight: bold;
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
    return (
      <Container>
        <Card width={1000} title={'My Reviews'}>
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
        </Card>
      </Container>
    );
  }
}

export default MyReviews;
