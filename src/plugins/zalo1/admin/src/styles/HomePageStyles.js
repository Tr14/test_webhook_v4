import styled from 'styled-components';
import { ViewContainer } from 'strapi-helper-plugin';

const Wrapper = styled(ViewContainer)`

  .headerBox {
    margin-top: 30px;
    margin-bottom: 10px;
    color: #292b2c;
  }

  .appBox {
    min-width: 222px;
    min-height: 200px;
    text-align: center;
    margin: 15px;
    background-color: #ffffff !important;
    border: 1px solid rgba(0, 0, 0, 0.125);
    box-shadow: 0 2px 4px #e3e9f3;     

    .appTitle {
      margin-top: 20px;
    }
  }

  
`;

export default Wrapper;
