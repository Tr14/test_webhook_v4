import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';

import { Header } from '@buffetjs/custom';
import { get } from 'lodash';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { useGlobalContext } from 'strapi-helper-plugin';

import pluginId from '../../pluginId';

import Category from './Category';
import Rename from './Rename';
import NavLink from "./NavLink";

import {DataProviderContext, useDataProvider} from '../../hooks/DataProvider';

import { getItemStyle, getQuestionListStyle, getLinkListStyle } from "./utils";

import EditPageStyles from '../../styles/EditPageStyles';

const EditPage = () => {

  const [isOpenCategory, setOpenCategory] = useState(false);
  const [isOpenRename, setOpenRename] = useState(false);
  
  const {
    modifiedData,
    linkData,

    category,
    onChangeCategory,
    onAddCategory,
    onDeleteCategory,

    addToCategory,
    removeFromCategory,
    moveBetweenCategory,
    reOrderInCategory,
    swapCategory,

    onSaveNavigation,

    isSave,
    isLoading

  } = useDataProvider();

  const { formatMessage } = useGlobalContext();
  
  const btnAdd = {
    onClick: () => {    
      onClickOpenCategory(); 
    },
    label: formatMessage({
      id: `${pluginId}.editpage.add`,
    }),
    type: 'button',
    disabled: false,
  };

  const btnSave = {
    onClick: () => {     
      onSaveNavigation(); 
    },
    label: formatMessage({
      id: `${pluginId}.editpage.save`,
    }),
    type: 'button',
    disabled: false,
  };

  const headerProps = {
    actions: [btnAdd, btnSave],
    title: {
      label: get(modifiedData, 'name'),
      // formatMessage({
      //   id: `${pluginId}.editpage.title`,
      // }),
      cta: {
        icon: 'pencil-alt',
        
        onClick: async () => {
          setOpenRename(true);
        }
      }
    },
    content: 
      formatMessage({
        id: `${pluginId}.editpage.description`,
      }),
  };

  const onClickOpenCategory = () => {
    setOpenCategory(true);
  }

  const onClickCloseCategory = () => {
    setOpenCategory(false);
  }

  const onAddCategoryHandler = () => {
    setOpenCategory(false);
    onAddCategory();
  }

  const onClickDeleteHandler = (evt) => {
    let {id} = evt.currentTarget;
    onDeleteCategory(id);
  }

  const onClickCloseRename = () => {
    setOpenRename(false);
  }
  
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    //drag category
    if (result.type === "CATEGORY") {
      swapCategory(result.source.index, result.destination.index);
    }

    //drag link
    else if (result.type === "LINK") {

      if (result.source.droppableId !== result.destination.droppableId) {
        if (result.source.droppableId === 'droppable-source') {
          addToCategory(linkData[result.source.index], result.source, result.destination);
        } 
        else if (result.destination.droppableId === 'droppable-source') {
          removeFromCategory(result.source.droppableId, result.source.index, result.destination.index);
        } else {
          moveBetweenCategory(result.source.droppableId, result.source.index, result.destination.droppableId, result.destination.index);
        }
      }

      else {
        if (result.source.droppableId !== 'droppable-source') {
          reOrderInCategory(result.source.droppableId, result.source.index, result.destination.index);
        }
      }
    }
  }

  return (
    <DataProviderContext.Provider
      // value={{ openModalAddField: handleClickAddField }}
    >
      <EditPageStyles>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 content">
              <Header style={{marginBottom: '5px'}} {...headerProps} />

              <div className="row ">
                <DragDropContext
                  onDragEnd={onDragEnd}>
                  <div className="col-md-1"></div>

                  <div className="col-md-5 navigation">
                    <h4>Navigation:</h4>
                    <div className="inner">
                    <Droppable droppableId="droppable" type="CATEGORY">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={getQuestionListStyle(snapshot.isDraggingOver)}
                        >
                          {modifiedData.navigation_categories && modifiedData.navigation_categories.map((question, index) => (
                            <Draggable
                              key={question.id}
                              draggableId={question.id}
                              index={index}
                              isDraggingOver={true}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                >
                                  <div className="category" 
                                    {...provided.dragHandleProps}>
                                    <span className="move">
                                      <i class="fas fa-ellipsis-v"></i>
                                    </span>
                                    <span className="title uppercase">{question.name}</span>
                                    <span className="delete" id={question.id} onClick={onClickDeleteHandler}>
                                      <i class="far fa-trash-alt"></i>
                                    </span>
                                  </div>
                                  
                                  <NavLink questionNum={index} question={question} />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>                        
                      )}
                    </Droppable>
                    </div>
                  </div>
                                    
                  <div className="col-md-5 links">
                    <h4>Available links:</h4>
                    <div className="inner">
                    <Droppable droppableId={`droppable-source`} type="LINK">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={getLinkListStyle(snapshot.isDraggingOver)}
                        >
                          {linkData.map((item, index) => (
                              <Draggable
                                key={`questionNum${index}`}
                                draggableId={`questionNum${index}`}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    style={getItemStyle(
                                      snapshot.isDragging,
                                      provided.draggableProps.style
                                    )}>
                                    
                                    <div className="category"
                                      {...provided.dragHandleProps}>
                                      <span className="move">
                                        <i class={`fas fa-${item.icon}`}></i>
                                      </span>
                                      <span className="title">{item.name}</span>   
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>                        
                      )}
                    </Droppable>
                    </div>
                  </div>
                  
                  <div className="col-md-1"></div>
                </DragDropContext>
              </div>
            </div>  
          </div>
        
          <Category 
            modifiedData={category}
            isOpen={isOpenCategory}
            isLoading={isLoading} 
            isSave={isSave}
            onChange={onChangeCategory}
            onAdd={onAddCategoryHandler}
            onClose={onClickCloseCategory}>
          </Category>

          <Rename 
            modifiedData={modifiedData}
            isOpen={isOpenRename}
            isLoading={isLoading} 
            isSave={isSave}
            onChange={onChangeCategory}
            onAdd={onAddCategoryHandler}
            onClose={onClickCloseRename}>
          </Rename>

        </div>
      </EditPageStyles>
    </DataProviderContext.Provider>
  );
};

export default EditPage;
