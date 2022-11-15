'use strict';

module.exports = ({ strapi }) => ({
  getWelcomeMessage() {
    return 'Welcome to AKA webhook custom app 🚀';
  },
  editLeadSuccess() {
    return 'Edit Lead success';
  },
  getLeadSuccess() {
    return 'Get Lead success';
  },
  deleteLeadSuccess() {
    return 'Delete Lead success';
  },
  getResultCompare() {
    return 'User does not exist';
  },
  getResultLogging() {
    return 'API return true'
  }
});
