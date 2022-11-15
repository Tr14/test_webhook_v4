import React, { memo, createContext, useContext, useEffect, useReducer, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import {
  request,
  LoadingIndicatorPage,
  useGlobalContext,
} from 'strapi-helper-plugin';

import {
  useHistory,
  useParams,
  useRouteMatch,
  Redirect,
} from 'react-router-dom';

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
  
  NEW_POPUP_CHANGE,
  NEW_POPUP_SAVE

} from './constant'

import pluginId from '../pluginId';

import reducer, { initialState } from './reducer';


const DataProviderContext = createContext();

const useDataProvider = () => useContext(DataProviderContext);

const DataProvider = ({ allIcons, children }) => {
  const [reducerState, dispatch] = useReducer(reducer, initialState);
  
  const {
    emitEvent,
    formatMessage,
    updatePlugin,
  } = useGlobalContext();
  
  const {
    newPopup,
    listData,
    isLoadingForDataToBeSet,
    initialData,
    modifiedData,
    initLinks,
    linkData,
    isLoading,
    category
  
  } = reducerState.toJS();

  //const { push } = useHistory();
  
  const isEdit = useRouteMatch(
    `/${strapi.org}/${pluginId}/:uid`
  );

  let { uid } = useParams();

  const getDetail = useRef();
  getDetail.current = async () => {
    
    dispatch({ type: GET_DETAIL });

    try {
      const result = await request(`/${pluginId}/detail/${uid}`, {
        method: 'GET'
      });

      dispatch({
        type: GET_DETAIL_SUCCEEDED,
        data: result.data
      });      

    } catch (err) {
      console.error({ err });
      strapi.notification.error('notification.error');
    }
  }

  const getDataRef = useRef();
  getDataRef.current = async () => {

    dispatch({ type: GET_NAVIGATION });

    try {
      const result = await request(`/${pluginId}/apps`, {
        method: 'GET'
      });

      dispatch({
        type: GET_NAVIGATION_SUCCEEDED,
        data: result.data
      });
      
    } catch (err) {
      console.error({ err });
      strapi.notification.error('notification.error');
    }
  };

  useEffect(() => {
    if (isEdit) {
      getDetail.current();
    } else {
      getDataRef.current();
    }

  }, [uid]);

  const onNewPopupChange = (name, value) => {
    dispatch({
      type: NEW_POPUP_CHANGE,
      name,
      value
    });
  }

  const onNewPopupSave = async () => {
    dispatch({
      type: NEW_POPUP_SAVE
    });

    try {

      const result = await request(`/${pluginId}/add`, {
        method: 'POST',
        body: {          
          ...newPopup
        }
      });

      // //auto redirect to edit app page if success
      // if (result.ok === true) {
      //   dispatch({
      //     type: SAVE_NEW_APP_SUCCEEDED
      //   });

      //   push(`/${strapi.org}/${pluginId}/${result.data.id}`);
      // }

    } catch (err) {
      strapi.notification.error('notification.error');
    }  
  }


  const onSyncFollowers =  async (id) => {
    //dispatch({ type: SAVE_NAVIGATION });

    try {
      const result = await request(`/${pluginId}/sync`, {
        method: 'POST',
        body: {id}
      });

      console.log(result);

      // dispatch({
      //   type: SAVE_NAVIGATION_SUCCEEDED,
      //   data: result.data
      // });
      
    } catch (err) {
      strapi.notification.error('notification.error');
    }
  }
  
  return (
    <DataProviderContext.Provider
      value={{
        newPopup,
        
        listData,
        modifiedData,
        linkData,
        isLoading,
        category,

        onNewPopupChange,
        onNewPopupSave,
        
        // onChangeCategory,
        // onAddCategory,
        // onDeleteCategory,
        
        // addToCategory,
        // removeFromCategory,
        // moveBetweenCategory,
        // reOrderInCategory,
        // swapCategory,

        // onSaveNavigation,
        onSyncFollowers,

      }}
    >
      {isLoadingForDataToBeSet ? (
        <LoadingIndicatorPage />
      ) : (
        <>
          {children}          
        </>
      )}
    </DataProviderContext.Provider>
  );
};

export default memo(DataProvider);

export {DataProviderContext, useDataProvider}
