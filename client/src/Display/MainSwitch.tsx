import { CircularProgress } from '@material-ui/core';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import Map from '../Map/Map';
import MyOffersList from '../Offers/MyOffersList/MyOffersList';
import OfferDisplay from '../Offers/OfferDisplay';
import CopyOffer from '../Offers/OfferForms/CopyOffer';
import CreateOffer from '../Offers/OfferForms/CreateOffer';
import EditOffer from '../Offers/OfferForms/EditOffer';
import { RootState } from '../rootReducer';
import EditAccount from '../User/EditAccount';
import LoginPage from '../User/LoginPage';
import RegisterForm from '../User/RegisterForm';
import ResetPw from '../User/ResetPw';
import FAQ from './FAQ';
import MobileMenu from './MobileMenu';
import MyAccount from './MyAccount';
import PrivacyPolicy from './PrivacyPolicy';

const MainSwitch: React.FC = () => {
  const isLoaded = useSelector(
    (state: RootState) => state.display.mapsLoaded,
  );

  const ref = useRef(null); // this fixed drawer re-rendering, why?

  return (
    <div ref={ref} style={{ position: 'relative', flex: 2 }} id="mainSwitchContainer">
      <Switch>
        <Route path="/create-offer" render={() => (isLoaded ? <CreateOffer /> : <CircularProgress />)} />
        <Route path="/my-offers/edit/:id" render={() => <EditOffer />} />
        <Route path="/my-offers/copy/:id" render={() => <CopyOffer />} />
        <Route path="/offers/:id" render={() => <OfferDisplay />} />
        <Route path="/register" render={() => <RegisterForm />} />
        <Route path="/login" render={() => <LoginPage />} />
        <Route path="/resetpw/:token" render={() => <ResetPw />} />
        <Route path="/my-account" render={() => <MyAccount />} />
        <Route path="/edit-account" render={() => <EditAccount />} />
        <Route path="/mobile-menu" render={() => <MobileMenu />} />
        <Route path="/my-offers" render={() => <MyOffersList />} />
        <Route path="/FAQ" render={() => <FAQ />} />
        <Route path="/privacy" render={() => <PrivacyPolicy />} />
        <Route path="/" render={() => (isLoaded ? <Map /> : <CircularProgress />)} />
      </Switch>
    </div>
  );
};

export default MainSwitch;
