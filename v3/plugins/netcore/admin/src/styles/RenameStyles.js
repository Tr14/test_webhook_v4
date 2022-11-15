import styled from 'styled-components';

const Wrapper = styled.div`

  .header {
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: rgb(250, 250, 250);

    .title {
      padding-top: 10px;
    }

    .col-md-1 {
      text-align: right;
    }
  }

  .scroll-container {
    border: 1px solid rgba(0, 0, 0, 0.125);
    min-height: 230px;
    height: 334px;
    overflow-y: auto;
  }

  .preview {
    text-align: center;
    height: 100%;
    width: 100%;
    
    .toolbar {
      height: 32px;
      background-color: rgb(250, 250, 250);
      border: 1px solid rgba(0, 0, 0, 0.125);
      vertical-align: middle;
      padding-top: 5px;
    }

    .iframe {
      height: 300px;
      width: 100%;
      border: none;
    }
  }

  .template {
    text-align: center;
    
    display: table;
    overflow-y: auto;

    .item {
      width: 200px;
      height: 200px;
      border: 1px solid rgba(0, 0, 0, 0.125);
      margin: 5px;
      float: left;
    }
  }

  .content {
    height: 100%;
    width: 100%;
    
    .iframe {
      height: 332px;
      width: 100%;
      border: none;
    }
  }

  .btn {
    min-width: 60px;
    padding: 5px;
  }

  .footer {
    height: 54px !important;
  }

`;

export default Wrapper;
