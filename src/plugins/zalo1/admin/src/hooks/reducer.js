import { fromJS, OrderedMap } from 'immutable';
import { get, has } from 'lodash';
import makeUnique from '../utils/makeUnique';
//import retrieveComponentsFromSchema from './utils/retrieveComponentsFromSchema';

import {
  GET_NAVIGATION,
  GET_NAVIGATION_ERROR,
  GET_NAVIGATION_SUCCEEDED, 
  
  GET_DETAIL,
  GET_DETAIL_ERROR,
  GET_DETAIL_SUCCEEDED,

  GET_LINKS,
  GET_LINKS_ERROR,
  GET_LINKS_SUCCEEDED,

  SET_LINKS,

  CHANGE_CATEGORY,
  ADD_CATEGORY,
  NEW_POPUP_CHANGE,
  NEW_POPUP_SAVE

} from './constant'

const initialState = fromJS({
  newPopup: {},
  isSave: false,
  listData: [],
  initialData: {},
  modifiedData: {},
  category: {},
  initLinks: [],
  linkData: [],
  isLoading: false,
  isLoadingForDataToBeSet: false,
});

const reducer = (state, action) => {
  switch (action.type) {
    case GET_NAVIGATION: {
      return state
        .update('isLoading', () => true);
    }
    
    case GET_NAVIGATION_SUCCEEDED: {
      return state
        .update('listData', () => action.data)
        .update('isLoading', () => false);
    }

    case GET_DETAIL: {
      return state
        .update('isLoading', () => true);
    }
    
    case GET_DETAIL_SUCCEEDED: {
      return state
        .update('modifiedData', () => action.data)
        .update('isLoading', () => false);
    }

    case GET_LINKS: {
      return state
        .update('isLoading', () => true);
    }
    
    case GET_LINKS_SUCCEEDED: {
      return state
        .update('initLinks', () => action.data)
        .update('linkData', () => action.links)        
        .update('isLoading', () => false);
    }

    case SET_LINKS: {
      return state
        .update('linkData', () => action.links);
    }

    case CHANGE_CATEGORY: {
      return state
        .updateIn(['category', action.name], () => action.value);
    }

    case ADD_CATEGORY: {
      if (action.links) {
        return state
          .update('modifiedData', () => action.data)
          .update('linkData', () => action.links);
      }
      
      return state
        .update('modifiedData', () => action.data);
    }

    case NEW_POPUP_CHANGE: {
      return state
        .updateIn(['newPopup', action.name], () => action.value);
    }

    case NEW_POPUP_SAVE: {
      return state
        .update('isSave', () => true);
    }

    default:
      return state;
  }
};

export default reducer;
export { initialState };
