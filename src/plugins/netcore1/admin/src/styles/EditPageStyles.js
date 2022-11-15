import styled from 'styled-components';
import { ViewContainer } from 'strapi-helper-plugin';

const Wrapper = styled(ViewContainer)`

  .header-title svg {
    margin-top: 8px;
  }
  
  .navigation {
    //min-height: calc(100vh - 5rem - 12rem);
  }

  .links {
    //min-height: calc(100vh - 5rem - 12rem);
  }

  .inner {
    background-color: #FFFFFF;    
    border: 1px solid rgba(0, 0, 0, 0.25);
    width: 100%;
    height: 100%;
  }

  .category {
    vertical-align: middle;

    .move {
      .svg {
        float: none !important;
      }
    }
    .title {
      padding-left: 10px;
      padding-top: 5px;
    }

    .uppercase {
      text-transform: uppercase;
    }

    .delete {
      cursor: pointer;
      float: right;
    }
  }
`;

export default Wrapper;
