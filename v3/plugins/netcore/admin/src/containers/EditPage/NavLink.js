import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { getItemStyle, getAnswerListStyle } from "./utils";

const NavLink = props => {
  const { question, questionNum } = props;
  return (
    <Droppable droppableId={question.id} type="LINK" >
      {(provided, snapshot) => {

        return (<div
          ref={provided.innerRef}
          style={getAnswerListStyle(snapshot.isDraggingOver)}
        >
          {question.navigation_links && question.navigation_links.map((answer, index) => {
            return (
              <Draggable
                key={`${questionNum}${index}`}
                draggableId={`${questionNum}${index}`}
                index={index}
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
                    <div className="category"
                      {...provided.dragHandleProps}>
                      <span className="move">
                        <i class={`fas fa-${answer.icon}`}></i>
                      </span>
                      <span className="title">{answer.name}</span>   
                    </div>                   
                  </div>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
        </div>)
        }}
    </Droppable>
  );
};

export default NavLink;
