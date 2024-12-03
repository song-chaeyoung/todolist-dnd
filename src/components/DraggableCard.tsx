import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";

interface DraggingProps {
  $isDragging: boolean;
}

const Card = styled.div<DraggingProps>`
  background: ${({ theme }) => theme.cardColor};
  border-radius: 8px;
  padding: 10px;
  box-shadow: ${(props) =>
    props.$isDragging
      ? "0px 2px 5px rgba(0,0,0,0.3)"
      : "0px 0px 5px rgba(0,0,0,0.1)"};
`;

interface DraggableCardProps {
  todoId: number;
  todoText: string;
  idx: number;
}

const DraggableCard = ({ todoId, todoText, idx }: DraggableCardProps) => {
  return (
    <Draggable key={todoId} draggableId={todoId + ""} index={idx}>
      {(magic, snapshot) => (
        <Card
          $isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.draggableProps}
          {...magic.dragHandleProps}
        >
          {todoText}
        </Card>
      )}
    </Draggable>
  );
};

export default React.memo(DraggableCard);
