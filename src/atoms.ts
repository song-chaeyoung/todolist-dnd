import { atom, selector } from "recoil";

export interface ToDo {
  id: number;
  text: string;
}

interface ToDoState {
  [key: string]: ToDo[];
}

export const toDoState = atom<ToDoState>({
  key: "toDo",
  default: {
    todo: [
      { id: 1, text: "리액트 공부하기" },
      { id: 2, text: "타입스크립트 공부히기" },
    ],
    doing: [{ id: 3, text: "Next.js 공부하기" }],
    done: [],
  },
});

export const totalToDoCount = selector({
  key: "totalToDoCount",
  get: ({ get }) => {
    const state = get(toDoState);
    const todoCount = state.todo.length;
    const doingCount = state.doing.length;
    const doneCount = state.done.length;
    return todoCount + doingCount + doneCount;
  },
});

export const isDarkAtom = atom<boolean>({
  key: "isDark",
  default: false,
});
