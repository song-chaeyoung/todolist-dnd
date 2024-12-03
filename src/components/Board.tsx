import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import DraggableCard from "./DraggableCard";
import { CiSquareCheck, CiStar } from "react-icons/ci";
import { FaChalkboardUser } from "react-icons/fa6";
import { ToDo, toDoState, totalToDoCount } from "../atoms";

const Container = styled.div`
  width: 100%;
  padding: 30px 10px 20px;
  border-radius: 8px;
  width: 100%;
  height: 100%;
`;

const Title = styled.h2<{ $boardId: string }>`
  /* text-align: center; */
  /* padding: 10px; */
  display: flex;
  border-radius: 12px;
  margin-bottom: 10px;
  font-size: 18px;
  text-transform: uppercase;
  overflow: hidden;
  font-family: "KartriderExtraBold";
  color: #fff;
  background: ${(props) =>
    props.$boardId === "todo"
      ? "#D5DBF9"
      : props.$boardId === "doing"
      ? "#FFD8BC"
      : "#C8F1F1"};
  > div {
    padding: 10px;
  }
  .main_title {
    flex: 2;
    display: flex;
    align-items: center;
    gap: 4px;
    border-radius: 12px;
    background: ${(props) =>
      props.$boardId === "todo"
        ? "#7487EB"
        : props.$boardId === "doing"
        ? "#FE7E21"
        : "#48D0D0"};
  }
  .sub_title {
    flex: 1;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
`;

interface AreaProps {
  $isDraggingOver: boolean;
  $isDraggingFromThis: boolean;
  $boardId: string;
}

const Area = styled.div<AreaProps>`
  /* background: #1e90ff; */
  width: 100%;
  background: ${(props) =>
    props.$isDraggingOver
      ? props.$boardId === "todo"
        ? "#D5DBF9"
        : props.$boardId === "doing"
        ? "#FFD8BC"
        : "#C8F1F1"
      : props.$isDraggingFromThis
      ? "#ccc"
      : props.theme.cardContainer};
  padding: 10px;
  flex: 1;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Form = styled.form`
  width: 100%;
`;

const Input = styled.input<{ $boardId: string }>`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 2px dashed
    ${(props) =>
      props.$boardId === "todo"
        ? "#D5DBF9"
        : props.$boardId === "doing"
        ? "#FFD8BC"
        : "#C8F1F1"};
  background: ${(props) => props.theme.cardInput};
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: ${(props) => props.theme.textColor};
    opacity: 0.75;
  }
`;

interface BoardProps {
  toDos: ToDo[];
  boardId: string;
}

interface FormProps {
  toDo: string;
}

const Board = ({ toDos, boardId }: BoardProps) => {
  const setToDos = useSetRecoilState(toDoState);
  const totalCount = useRecoilValue(totalToDoCount);
  const { register, setValue, handleSubmit } = useForm<FormProps>();

  const onVaild = ({ toDo }: FormProps) => {
    const newTodo = {
      id: Date.now(),
      text: toDo,
    };

    setToDos((allBoards) => {
      return { ...allBoards, [boardId]: [...allBoards[boardId], newTodo] };
    });
    setValue("toDo", "");
  };

  // const allLength = toDoState.

  return (
    <Container>
      <Title $boardId={boardId}>
        <div className="main_title">
          {boardId === "todo" ? (
            <CiStar size={20} />
          ) : boardId === "doing" ? (
            <FaChalkboardUser size={20} />
          ) : (
            <CiSquareCheck size={20} />
          )}
          {boardId}
        </div>
        <div className="sub_title">{`${toDos.length} / ${totalCount}`}</div>
      </Title>
      <Droppable droppableId={boardId}>
        {(magic, snapshot) => (
          <Area
            $isDraggingOver={snapshot.isDraggingOver}
            $isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            $boardId={boardId}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {toDos.map((todo, idx) => (
              <DraggableCard
                key={todo.id}
                todoId={todo.id}
                todoText={todo.text}
                idx={idx}
              />
            ))}
            {magic.placeholder}
            <Form onSubmit={handleSubmit(onVaild)}>
              <Input
                $boardId={boardId}
                {...register("toDo", { required: true })}
                type="text"
                placeholder={`+ Add new task on ${boardId}`}
              />
            </Form>
          </Area>
        )}
      </Droppable>
    </Container>
  );
};

export default Board;
