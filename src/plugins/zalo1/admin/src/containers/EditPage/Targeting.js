import React from 'react';

import { get } from 'lodash';

import {
  HeaderModal,
  //HeaderModalTitle,
  Modal,
  ModalBody,
  ModalFooter,
  //ModalForm,
  InputsIndex as Input, 
  useGlobalContext 
} from 'strapi-helper-plugin';

import pluginId from '../../pluginId';

import TargetingStyles from '../../styles/TargetingStyles';

const Targeting = ({isOpen, isLoading, segmentations, targetings, isSave, onClose, onAdd, onRemove, onSave}) => {

  const { formatMessage } = useGlobalContext();

  const onClickSaveHandler = () => {
    onSave();
  }

  const onClickAddTargetHandler = (evt) => {
    onAdd(evt.currentTarget.id);
  }

  const onClickRemoveTargetHandler = (evt) => {
    onRemove(evt.currentTarget.id);
  }

  let clsSave = isSave ? `${pluginId}.editpage.targeting.saving` : `${pluginId}.editpage.targeting.save`;

  return (
    <Modal isOpen={isOpen} onToggle={onClose}>
      <TargetingStyles>
        <HeaderModal>
          <section>
            <h3 className="title">{formatMessage({
                id: `${pluginId}.editpage.targeting.title`
              }).toUpperCase()}
            </h3>
          </section>
          {/* <section>
            <HeaderModalTitle>sub title</HeaderModalTitle>
            <hr />
          </section> */}
        </HeaderModal>
      
        <ModalBody>
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-1"></div>
              <div className="col-md-5 left">
                <h5>Segmentations:</h5>
              </div>
              <div className="col-md-5 right">
                <h5>Targeting:</h5>
              </div>
            </div>

            <div className="row">
              <div className="col-md-1"></div>
              <div className="col-md-5 segmentation left">
                {segmentations && segmentations.map((item, index) => {
                  return (
                    <div key={index} className="row item">
                      <div className="col-md-10">{item.name}</div>
                      <div className="col-md-2 add"><button id={item.id} onClick={onClickAddTargetHandler}><i class="far fa-plus-square"></i></button></div>
                    </div>  
                  );
                })}
              </div>
              <div className="col-md-5 segmentation right">
                {targetings && targetings.map((item, index) => {
                  return (
                    <div key={index} className="row item">
                      <div className="col-md-10">{item.name}</div>
                      <div className="col-md-2 add"><button id={item.id} onClick={onClickRemoveTargetHandler}><i class="fas fa-times"></i></button></div>
                    </div>  
                  );
                })}
              </div>
            </div>                
          </div>
        </ModalBody>
        
        <ModalFooter>
          <section>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              {formatMessage({id: `${pluginId}.editpage.targeting.cancel`})}
            </button>
            <button type="button" className={"btn btn-primary" + (isSave ? " disabled": "")} 
              disabled={isSave}
              onClick={onClickSaveHandler}>
              {formatMessage({id: clsSave})}                  
            </button>
          </section>
        </ModalFooter>
      </TargetingStyles>  
    </Modal>
  );
}

export default Targeting;
