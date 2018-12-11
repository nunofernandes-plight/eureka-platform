import React, {Component} from 'react';
import styled from 'styled-components';
import {getDomain} from '../../../../helpers/getDomain.mjs';
import Modal from '../../design-components/Modal.js';
import DashboardCard, {
  DashboardCardContainer,
  DashboardCardTitle,
  getDashboardColor
} from './DashboardCard.js';
import EurekaRotateSpinner from '../../views/spinners/EurekaRotateSpinner.js';
import {EXTRA_LARGE_DEVICES} from '../../../helpers/mobile.js';
import {connect} from 'react-redux';
import Roles from '../../../../backend/schema/roles-enum.mjs';
import DashboardCardTopIcon from './DashboardCardTopIcon.js';
import {becomeAReviewer} from '../../reducers/reviewer.js';
import {fetchUserData} from '../../reducers/user.js';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const Cards = styled.div`
  display: flex;
  width: 85%;
  box-sizing: border-box;

  ${EXTRA_LARGE_DEVICES`
   flex-direction: column;
  `};
`;

const NotAReviewer = styled.div`
  &:hover {
    transform: translateY(-2px);
  }
  transition: 0.3s all ease-in-out;
  width: 220px;
  text-align: center;
  align-self: center;
  padding: 10px 12px;
  border-radius: 6px;
  background: ${props => props.color};
  color: white;
  cursor: pointer;
`;

const Guard = ({stat, title, roles, ...otherProps}) => {
  // User is not a reviewer
  if (
    title === 'Reviews' &&
    !(roles.includes(Roles.EXPERT_REVIEWER) || roles.includes(Roles.REVIEWER))
  ) {
    return (
      <DashboardCardContainer height={'28%'}>
        <DashboardCardTopIcon
          icon={stat.icon}
          color={getDashboardColor(title)}
        />
        <DashboardCardTitle>{stat.title}</DashboardCardTitle>
        <NotAReviewer
          color={getDashboardColor(title)}
          onClick={async () => {
            await otherProps.becomeAReviewer();
            await otherProps.fetchUserData();
          }}
        >
          Become a EUREKA Reviewer!{' '}
          {otherProps.becomingReviewerLoading ? '...' : null}
        </NotAReviewer>
      </DashboardCardContainer>
    );
  }
  return otherProps.children;
};

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      analytics: null,
      loading: true,
      errorMessage: null
    };
  }

  componentDidMount() {
    fetch(`${getDomain()}/api/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({analytics: response.data, loading: false});
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
          articlesLoading: false
        });
      });
  }

  renderModal() {
    return (
      <Modal
        type={'notification'}
        toggle={() => {
          this.setState({errorMessage: null});
        }}
        show={this.state.errorMessage}
        title={'You got the following error'}
      >
        {this.state.errorMessage}
      </Modal>
    );
  }
  render() {
    return (
      <Container>
        {this.renderModal()}
        {this.state.loading ? (
          <EurekaRotateSpinner />
        ) : (
          <Cards>
            {this.state.analytics.map((stat, i) => {
              return (
                <Guard
                  stat={stat}
                  key={i}
                  title={stat.title}
                  roles={this.props.user.roles}
                  {...this.props}
                >
                  <DashboardCard key={i} stat={stat} />
                </Guard>
              );
            })}
          </Cards>
        )}
      </Container>
    );
  }
}

export default connect(
  state => ({
    user: state.userData.data,
    becomingReviewerLoading: state.reviewerData.loading
  }),
  dispatch => () => {
    return {
      fetchUserData: () => {
        dispatch(fetchUserData());
      },
      becomeAReviewer: () => {
        dispatch(becomeAReviewer());
      }
    };
  }
)(Dashboard);
