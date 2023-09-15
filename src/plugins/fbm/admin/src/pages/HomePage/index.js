/*
 *
 * HomePage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';

const HomePage = () => {
  return (
    <div>
      <h1 style={{ color: "white", paddingLeft: "5%" }}>Welcome to Facebook section</h1>
      <br />
      <button style={{ color: "blue", background: "white", paddingLeft: "5%" }} href="https://www.facebook.com/v17.0/dialog/oauth?client_id=843916146887327&redirect_uri=https://dev.akadigital.net/&scope=ads_management">Approve Facebook Permission</button>
    </div>
  );
};

export default HomePage;
