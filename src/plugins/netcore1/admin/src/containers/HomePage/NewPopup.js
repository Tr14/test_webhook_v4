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

import NewCampaignStyles from '../../styles/NewCampaignStyles';

const NewPopup = ({isOpen, modifiedData, isSave, onClose, onChange, onSave}) => {

  const { formatMessage } = useGlobalContext();
  
  const onClickSaveHandler = () => {
    onSave();
  }

  const onValueChange = (evt) => {
    const {type, name, value} = evt.target;
    onChange(name, value);
  }

  let clsSave = isSave ? `${pluginId}.newpage.saving` : `${pluginId}.newpage.save`;

  return (
    <Modal isOpen={isOpen} onToggle={onClose}>
      <NewCampaignStyles>
        <form >
          <HeaderModal>
            <section>
              <h3 className="title">{formatMessage({
                  id: `${pluginId}.newpage.header.title`
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
                {/* <div className="col-md-3"></div> */}
                <Input
                  customBootstrapClass="col-md-12"
                  //inputClassName="inputStyle"
                  label={formatMessage({
                    id: `${pluginId}.newpage.name`
                  })}
                  name="name"
                  onChange={onValueChange}
                  type="text"
                  value={get(modifiedData, 'name')}
                />

                <Input
                  customBootstrapClass="col-md-12"
                  //inputClassName="inputStyle"
                  label={formatMessage({
                    id: `${pluginId}.newpage.token`
                  })}
                  name="token"
                  onChange={onValueChange}
                  type="text"
                  value={get(modifiedData, 'token')}
                />

                {/* <div className="col-md-3"></div> */}
              </div>                
            </div>
          </ModalBody>
          
          <ModalFooter>
            <section>
              <button type="button" className="btn btn-outline-primary" color="primary" onClick={onClose}>
                {formatMessage({id: `${pluginId}.newpage.cancel`})}
              </button>
              <button type="button" className={"btn btn-primary" + (isSave ? " disabled": "")} color="primary" 
                disabled={isSave}
                onClick={onClickSaveHandler}>
                {formatMessage({id: clsSave})}                  
              </button>
            </section>
          </ModalFooter>
        </form>
      </NewCampaignStyles>  
    </Modal>
  );
}

export default NewPopup;
