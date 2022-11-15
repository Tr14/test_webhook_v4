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

import RenameStyles from '../../styles/RenameStyles';

const Rename = ({
    isOpen, 
    modifiedData, 
    onChange, onAdd,
    onClose }) => {

  const { formatMessage } = useGlobalContext();

  const onValueChange = (evt) => {
    const {name, value} = evt.target;
    onChange(name, value);
  }

  return (
    <Modal isOpen={isOpen} onToggle={onClose} className="modal-half">
      <RenameStyles>
        <HeaderModal>
          <div className="container-fluid">
            <div className="row header">
              <div className="col-md-10">
                <h3 className="title">{formatMessage({
                    id: `${pluginId}.editpage.rename.title`
                  }).toUpperCase()}
                </h3>
              </div>
              {/* <div className="col-md-1">
                <button type="button" className="btn btn-primary" onClick={onClose}>
                  {formatMessage({id: `${pluginId}.editpage.category.cancel`})}
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
                  id: `${pluginId}.editpage.rename.name`
                })}
                name="name"
                onChange={onValueChange}
                type="text"
                value={get(modifiedData, 'name')}
              />
            </div>                           
          </div>
        </ModalBody>
        
        <ModalFooter>
          <section class="footer">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              {formatMessage({id: `${pluginId}.editpage.rename.cancel`})}
            </button>
            <button type="button" className="btn btn-primary" onClick={onAdd}>
              {formatMessage({id: `${pluginId}.editpage.rename.save`})}                  
            </button>
          </section>
        </ModalFooter>
      </RenameStyles>  
    </Modal>  
  );
}

export default Rename;
