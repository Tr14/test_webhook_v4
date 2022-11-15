import styled from 'styled-components';

const Wrapper = styled.div`
  
  .title {
    padding-top: 20px;
  }

  .segmentation {
    border: 1px solid rgba(0, 0, 0, 0.125);
    min-height: 150px;
    max-height: 250px;

    .item {
      padding-top: 5px;
      padding-bottom: 5px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }

    .add {
      text-align: right;
    }
  }

  .left {
    margin-right: 10px;
  }

  .right {
    margin-left: 10px;
  }

`;

export default Wrapper;
