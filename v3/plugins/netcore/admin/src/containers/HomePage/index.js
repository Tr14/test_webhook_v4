import React, {useState} from 'react';
import { useHistory, NavLink } from 'react-router-dom';

import { Header } from '@buffetjs/custom';

import { sortBy, upperFirst } from 'lodash';

import { useGlobalContext, ListWrapper } from 'strapi-helper-plugin';

import {DataProviderContext, useDataProvider} from '../../hooks/DataProvider';


//import CustomLink from '../../components/CustomLink';
// import ListHeader from '../../components/ListHeader';
// import getTrad from '../../utils/getTrad';
// import makeSearch from '../../utils/makeSearch';

import pluginId from '../../pluginId';

import NewPopup from './NewPopup';

import HomePageStyles from '../../styles/HomePageStyles';

const HomePage = () => {

  const [isOpenNew, setOpenNew] = useState(false);

  const {
    newPopup,
    
    listData,
    modifiedData,
    
    onNewPopupChange,
    onNewPopupSave,

    onSyncFollowers
  } = useDataProvider();

  const { formatMessage } = useGlobalContext();
  const { push } = useHistory();

  const formatDate = (dateString) => {
    var date = new Date(dateString);

    return <p>
      {date.getHours() + ':' + date.getMinutes()} {date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()}
    </p>
  };

  const btnSync = {
    onClick: () => {
      onClickSyncHandler();
    },
    label: formatMessage({
      id: `${pluginId}.homepage.sync`,
    }),
    type: 'button',
    disabled: false,
  };
  
  const btnAdd = {
    onClick: () => {
      setOpenNew(true);
    },
    label: formatMessage({
      id: `${pluginId}.homepage.add`,
    }),
    type: 'button',
    disabled: false,
  };

  const headerProps = {
    actions: [btnAdd],
    title: {
      label:  formatMessage({
        id: `${pluginId}.homepage.title`,
      }),
      cta: null,
    },
    content: `Found ${listData ? listData.length : 0} app(s) from your account`
  };

  const onClickSyncHandler = (evt) => {    
    let {id} = evt.currentTarget.dataset;

    onSyncFollowers(id);
  };
  
  const onClickCloseNewPopup = () => {
    setOpenNew(false);
  }

  return (
    <DataProviderContext.Provider
      // value={{ openModalAddField: handleClickAddField }}
    >
      <HomePageStyles>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 content">
              
              <Header {...headerProps} />

              <div className="row">
                {listData.map((item, index) => {
                  return <div key={index} className="appBox">
                    <div>
                      <h3 className="appTitle">
                        <NavLink to={`/plugins/${pluginId}/${item.id}`}>
                          {upperFirst(item.name)}
                        </NavLink>
                      </h3>                      
                    </div>  
                    <div>Created at: {formatDate(item.created_at)}</div>    
                    <div>Updated at: {formatDate(item.updated_at)}</div>   
                    <button className="btn btn-primary" data-id={item.id} onClick={onClickSyncHandler}>Sync followers</button>             
                  </div>
                })}     

              </div>
            </div>  
          </div>
        </div>

        <NewPopup 
          modifiedData={newPopup} 
          isOpen={isOpenNew} 
          isSave={false}
          onClose={onClickCloseNewPopup}
          onChange={onNewPopupChange}
          onSave={onNewPopupSave}>
        </NewPopup>

      </HomePageStyles>
    </DataProviderContext.Provider>
  );
};

export default HomePage;
