import React, {useState} from 'react';
import { useHistory, useLocation, NavLink } from 'react-router-dom';

import { Stage, Layer, Image } from 'react-konva';

import { Header } from '@buffetjs/custom';
import { get, upperFirst, upperCase } from 'lodash';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Reorder, getItemStyle, getQuestionListStyle } from "./utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Answers from "./Answers";

import { useGlobalContext, ListWrapper } from 'strapi-helper-plugin';

import {DataProviderContext, useDataProvider} from '../../hooks/DataProvider';

//import useDataProvider from '../../hooks/useDataProvider';
import pluginId from '../../pluginId';

import Targeting from './Targeting';
import Content from './Content';

import EditPageStyles from '../../styles/EditPageStyles';

const EditPage = () => {

  const [isOpenContent, setOpenContent] = useState(false);
  const [isOpenTargeting, setOpenTargeting] = useState(false);
  

  const {
    modifiedData,
    onLoadSegmetation,
    onLoadTemplate,
    onChangeContent,
    onSaveContent,

    onLaunchCampaign,
    isSave

  } = useDataProvider();

  const { formatMessage } = useGlobalContext();
  const { push } = useHistory();
  const location = useLocation();

  const buttonActivity = {
    onClick: () => {     
    },
    label: formatMessage({
      id: `${pluginId}.editpage.activity`,
    }),
    type: 'button',
    disabled: true,
  };

  const buttonTest = {
    onClick: () => {
      
    },
    label: formatMessage({
      id: `${pluginId}.editpage.test`,
    }),
    type: 'button',
    disabled: true,
  };

  const buttonLaunch = {
    onClick: () => {    
      onLaunchCampaign(); 
    },
    label: formatMessage({
      id: `${pluginId}.editpage.launch`,
    }),
    type: 'button',
    disabled: false,
  };

  const headerProps = {
    actions: [buttonActivity, buttonTest, buttonLaunch],
    title: {
      label: get(modifiedData, 'name'),
      // formatMessage({
      //   id: `${pluginId}.editpage.title`,
      // }),
      cta: null,
    },
    content: 'Created by UNITO at 12:12 20/08/2020'
    // formatMessage({
    //   id: `${pluginId}.editpage.description`,
    // }),
  };

  // curStep = location.hash.substr(1, location.hash.length);
  // if (curStep === "") {
  //   curStep = headerNavLinks[0].id;
  // } 

  //var Comp = getComponentByID(curStep);

  const onClickOpenContent = () => {
    if (!modifiedData.campaign_content) {
      onLoadTemplate();
    }
    setOpenContent(true);
  }

  const onClickCloseContent = () => {
    setOpenContent(false);
  }
  
  const onClickOpenTargeting = () => {
    onLoadSegmetation();
    setOpenTargeting(true);
  }
  
  const onClickCloseTargeting = () => {
    setOpenTargeting(false);
  }

  const onDragEnd = (result) => {
    // dropped outside the list
    // if (!result.destination) {
    //   //console.log("no-change");
    //   return;
    // }

    // if (result.type === "QUESTIONS") {
    //   console.log(result);
    //   const questions = Reorder(
    //     this.state.questions,
    //     result.source.index,
    //     result.destination.index
    //   );

    //   this.setState({
    //     questions
    //   });
    // } else {
    //   const answers = Reorder(
    //     this.state.questions[parseInt(result.type, 10)].answers,
    //     result.source.index,
    //     result.destination.index
    //   );

    //   const questions = JSON.parse(JSON.stringify(this.state.questions));

    //   questions[result.type].answers = answers;

    //   this.setState({
    //     questions
    //   });
    // }
  }

  console.log(modifiedData)

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
                <div className="col-md-12 categories">
                  <div className="inner">
                    
                  <DragDropContext
                    onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable" type="QUESTIONS">
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
                                  {question.name}
                                  <span {...provided.dragHandleProps}>
                                    <FontAwesomeIcon
                                      icon={"grip-vertical"}
                                      style={{ float: "left" }}
                                    />
                                  </span>
                                  <Answers questionNum={index} question={question} />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                    
                  </div>
                </div>

                {/* <div className="col-md-8 links">
                  <div className="inner">
                    <Source/>
                  </div>
                </div> */}

              </div>

              {/* <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="title"><span><i class="fas fa-chart-bar"></i></span>Campaign Performance</h5>
                    </div>
                    
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-2">
                          <h3>Targeting</h3>
                          <p>...</p>
                        </div>

                        <div className="col-md-2">
                          <h3>Delivered</h3>
                          <p>...</p>
                        </div>

                        <div className="col-md-2">
                          <h3>Sent</h3>
                          <p>...</p>
                        </div>

                        <div className="col-md-2">
                          <h3>Opened</h3>
                          <p>...</p>
                        </div>

                        <div className="col-md-2">
                          <h3>Clicked</h3>
                          <p>...</p>
                        </div>

                        <div className="col-md-2">
                          <h3>Conversion</h3>
                          <p>...</p>
                        </div>
                        
                      </div> 
                    </div>

                    <div className="card-footer">
                      <div className="row">
                        <div className="col-md-6">
                          Last launch: 12:00PM 20/08/2020
                        </div>
                        <div className="col-md-2" style={{textAlign: "center"}}>
                          <i class="fas fa-chart-bar"></i>Report
                        </div>
                        <div className="col-md-2" style={{textAlign: "center"}}>
                          <i class="fas fa-sync-alt"></i>Refresh
                        </div>
                        <div className="col-md-2" style={{textAlign: "center"}}>
                          <i class="fas fa-download"></i>Download
                        </div>  
                      </div>  
                    </div>  
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-5">
                  <div className="card left">
                    <div className="card-header">
                      <div className="row">
                        <div className="col-md-8">
                          <h5 className="title"><span><i class="far fa-sticky-note"></i></span>Message content</h5>
                        </div>
                        <div className="col-md-4" style={{textAlign: "right"}}>
                        <button onClick={onClickOpenContent}><i class="fas fa-edit"></i></button>
                        </div>
                      </div>
                      
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">Create content of campaign</h5>  
                      {modifiedData.campaign_content && (
                        <p>{modifiedData.campaign_content.title}</p>
                      )}

                    </div>
                  </div>
                </div>

                <div className="col-md-7">
                  <div class="row">
                    <div className="col-md-6">
                      <div className="card right">
                        <div className="card-header">
                          <div className="row">
                            <div className="col-md-8">
                              <h5 className="title"><span><i class="fas fa-users"></i></span>Targeting</h5>
                            </div>
                            <div className="col-md-4" style={{textAlign: "right"}}>
                              <button onClick={onClickOpenTargeting}><i class="fas fa-edit"></i></button>                              
                            </div>
                          </div>
                          
                        </div>
                        <div className="card-body">
                          <h5 className="">Campaign will be sent to contacts of:</h5>  
                          {modifiedData.segmentations && modifiedData.segmentations.map((item, index) => {
                            return (
                              <div key={index} className="row item">
                                <div className="col-md-10">{(index + 1)}. {item.name}</div>
                              </div>  
                            )}
                          )}            
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card right">
                        <div className="card-header">
                          <div className="row">
                            <div className="col-md-8">
                              <h5 className="title"><span><i class="fas fa-info-circle"></i></span>Campaign info</h5>
                            </div>
                            <div className="col-md-4" style={{textAlign: "right"}}>
                              <i class="fas fa-edit"></i>
                            </div>
                          </div>
                          
                        </div>
                        <div className="card-body">
                          <h5 className="card-title">Basic information of campaign:</h5>                      
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row" style={{marginTop: '10px'}}>
                    <div className="col-md-6">
                      <div className="card right">
                        <div className="card-header">
                          <div className="row">
                            <div className="col-md-8">
                              <h5 className="title"><span><i class="far fa-calendar-alt"></i></span>Launch settings</h5>
                            </div>
                            <div className="col-md-4" style={{textAlign: "right"}}>
                              <i class="fas fa-edit"></i>
                            </div>
                          </div>
                          
                        </div>
                        <div className="card-body">
                          <h5 className="card-title">Campaign will be launch at:</h5>                      
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card right">
                        <div className="card-header">
                          <div className="row">
                            <div className="col-md-8">
                              <h5 className="title"><span><i class="fas fa-tools"></i></span>Advanced settings</h5>
                            </div>
                            <div className="col-md-4" style={{textAlign: "right"}}>
                              <i class="fas fa-edit"></i>
                            </div>
                          </div>
                          
                        </div>
                        <div className="card-body">
                          <h5 className="card-title">Additional setings of campaign:</h5>                      
                        </div>
                      </div>
                    </div>  
                  </div>
                </div>

              </div>

              <Content 
                modifiedData={modifiedData}
                content={content}
                templates={templates}
                template={template}
                isOpen={isOpenContent}
                isLoading={isLoading} 
                isSave={isSave}
                onLoad={onLoadTemplate}
                onSelect={onSelectTemplate}
                onPreview={onPreviewTemplate}
                onChange={onChangeContent}
                onSave={onSaveContent}
                onClose={onClickCloseContent}>
              </Content>
              
              <Targeting 
                modifiedData={modifiedData}
                segmentations={segmentations} 
                targetings={modifiedData.segmentations}
                onAdd={onAddTargeting}
                onRemove={onRemoveTargeting}
                isOpen={isOpenTargeting}
                isLoading={isLoading} 
                isSave={isSave}
                onClose={onClickCloseTargeting}
                onSave={onSaveTargeting}>
              </Targeting> */}

            </div>  
          </div>
        </div>
      </EditPageStyles>
    </DataProviderContext.Provider>
  );
};

export default EditPage;
