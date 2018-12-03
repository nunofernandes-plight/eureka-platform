import React, {Fragment} from 'react';
import {Route} from 'react-router';
import MyHistory from '../MyHistory/MyHistory.js';
import {BottomContainer} from '../../views/BottomContainer.js';
import {Redirect} from 'react-router-dom';
import MySubmitted from '../Articles/MySubmitted.js';
import {Card} from '../../views/Card.js';
import MyDrafts from '../Articles/Online/MyDrafts.js';
import DocumentEditor from '../Articles/Online/TextEditor/DocumentEditor.js';

export const DraftsRouter = ({base}) => {
  return (
    <Fragment>
      <Route
        exact
        path={`${base}/online`}
        render={() => <MyDrafts base={`${base}/online`} />}
      />

      <Route
        exact
        path={`${base}/online/:id`}
        render={() => <DocumentEditor base={base} />}
      />

      <Route
        exact
        path={`${base}/pdfs`}
        render={() => <Card title={'culO'}>asfoafoasjofas</Card>}
      />

      <Route
        exact
        path={`${base}`}
        render={() => <Redirect to={`${base}/online`} />}
      />
    </Fragment>
  );
};
