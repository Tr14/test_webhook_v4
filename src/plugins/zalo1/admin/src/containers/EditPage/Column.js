import React from "react";
import Item from "./Item";
import Category from "./Category";

import { Droppable, Draggable } from "react-beautiful-dnd";

const Column = ({ col: { category, id } }) => {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div style={{margin: '30px'}}>
          <h2>{id}</h2>
          <div style={{minHeight: 200}} {...provided.droppableProps} ref={provided.innerRef}>
            {category.map((item, index) => (
              <Category key={index} item={item} index={index} />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default Column;
