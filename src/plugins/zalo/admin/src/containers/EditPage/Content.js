import React, { useState } from 'react';

import { get } from 'lodash';

import {
  HeaderModal,
  HeaderModalTitle,
  Modal,
  ModalBody,
  ModalFooter,
  //ModalForm,
  InputsIndex as Input, 
  useGlobalContext 
} from 'strapi-helper-plugin';

import pluginId from '../../pluginId';

import ContentStyles from '../../styles/ContentStyles';

const Content = ({
    isOpen, isLoading, isSave,
    modifiedData, templates, content, template,
    onPreview, onSelect, onLoad, onAdd, onRemove, onChange,
    onClose, onSave }) => {

  const { formatMessage } = useGlobalContext();

  const onValueChange = (evt) => {
    const {name, value} = evt.target;
    onChange(name, value);
  }

  const onClickSelectHandler = (evt) => {
    let index = _.findIndex(templates, ['id', evt.currentTarget.id]);
    if (index !== -1) {
      onSelect(templates[index]);
    }
  }
  
  const onClickPreviewHandler = (evt) => {
     let index = _.findIndex(templates, ['id', evt.currentTarget.id]);
     if (index !== -1) {
      onPreview(templates[index]);
     }
  }

  const onClickChangeTemplateHandler = (evt) => {
    onPreview(null);
  }
 
  //console.log(templates);

  let clsSave = isSave ? `${pluginId}.editpage.content.saving` : `${pluginId}.editpage.content.save`;

  return (
    <Modal isOpen={isOpen} onToggle={onClose} className="modal-full">
      <ContentStyles>
        <HeaderModal>
          <div className="container-fluid">
            <div className="row header">
              <div className="col-md-10">
                <h3 className="title">{formatMessage({
                    id: `${pluginId}.editpage.content.title`
                  }).toUpperCase()}
                </h3>
              </div>
              {/* <div className="col-md-1">
                <button type="button" className="btn btn-primary" onClick={onClose}>
                  {formatMessage({id: `${pluginId}.editpage.content.cancel`})}
                </button>
              </div>
              <div className="col-md-1"> 
                <button type="button" className={"btn btn-primary" + (isSave ? " disabled": "")} 
                  disabled={isSave}
                  onClick={onSave}>
                  {formatMessage({id: clsSave})}                  
                </button>
              </div> */}
            </div>      
          </div>  
        </HeaderModal>
      
        <ModalBody>
          <div className="col-md-12">
            <div className="row">
              <Input
                customBootstrapClass="col-md-12"
                //inputClassName="inputStyle"
                label={formatMessage({
                  id: `${pluginId}.editpage.content.title`
                })}
                name="title"
                onChange={onValueChange}
                type="text"
                value={get(content, 'title')}
              />
            </div>

            <div className="row">
              <div className="col-md-12">
                {/* {!content && (
                <button type="button" className="btn btn-primary">
                  {formatMessage({id: `${pluginId}.editpage.content.select`})}
                </button>
                )} */}

                <div className="scroll-container">

                  {template || content.description && (
                    <div className="preview">
                      <div className="toolbar">
                        <button><i class="fas fa-desktop"></i>Desktop</button>
                        <button><i class="fas fa-tablet-alt"></i>Tablet</button>
                        <button><i class="fas fa-mobile-alt"></i>Mobile</button>
                        
                        <button onClick={onClickChangeTemplateHandler}><i class="fas fa-arrow-left"></i>Change</button>
                        
                      </div>
                      <iframe className="iframe" srcdoc={template ? template.sourcecode : content.description}></iframe>
                    </div>
                  )}
                  
                  {!template && !content.description && (
                  <div className="template">
                    {templates && templates.map((item, index) => {
                      return (
                        <div key={index} className="item">
                          <div className="">{item.name}</div>
                          <div className="">
                            <button id={item.id} onClick={onClickSelectHandler}>Select</button>
                            <button id={item.id} onClick={onClickPreviewHandler}>Preview</button>
                          </div>
                        </div>  
                      );
                    })}
                  </div>
                  )}

                </div>    
              </div>  
            </div>
                           
          </div>
        </ModalBody>
        
        <ModalFooter>
          <section class="footer">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              {formatMessage({id: `${pluginId}.editpage.content.cancel`})}
            </button>
            <button type="button" className={"btn btn-primary" + (isSave ? " disabled": "")} 
              disabled={isSave}
              onClick={onSave}>
              {formatMessage({id: clsSave})}                  
            </button>
          </section>
        </ModalFooter>
      </ContentStyles>  
    </Modal>  
  );
}

export default Content;
