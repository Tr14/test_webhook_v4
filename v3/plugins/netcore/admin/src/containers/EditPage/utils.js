export const getItemStyle = (isDragging, draggableStyle) => {
  return {
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    paddingLeft: '15px',
    padding: 6,
    //margin: `0 0 ${grid}px 0`,
    textAlign: "left",

    // change background colour if dragging
    background: isDragging ? "#0064BF" : "none",

    color: isDragging ? "#FFFFFF" : "rgb(41, 43, 44)",

    // styles we need to apply on draggables
    ...draggableStyle
  };
};

export const getQuestionListStyle = isDraggingOver => ({
  border: isDraggingOver ? "dotted 2px #0064BF" : "none",
  padding: 4,
  width: '100%'
});

export const getAnswerListStyle = isDraggingOver => ({
  border: isDraggingOver ? "dotted 2px #0064BF" : "none",
  //background: isDraggingOver ? "lightblue" : "lightgrey",
  marginLeft: '15px',
  paddingTop: '4px',
  paddingBottom: '4px',
  marginRight: '15px',
});

export const getLinkListStyle = isDraggingOver => ({
  border: isDraggingOver ? "dotted 2px #0064BF" : "none",
  //background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: 4,
});