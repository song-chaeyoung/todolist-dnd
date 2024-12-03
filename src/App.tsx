import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { FiSun } from "react-icons/fi";
import { useRecoilState } from "recoil";
import { isDarkAtom, toDoState } from "./atoms";
import Board from "./components/Board";
import { darkTheme, lightTheme } from "./theme";
import { FaRegMoon } from "react-icons/fa6";
import { LuDownload } from "react-icons/lu";
import { useRef } from "react";
import html2canvas from "html2canvas";

const GlobalStyle = createGlobalStyle`
@font-face {
  font-family: "KartriderExtraBold";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2312-1@1.1/KartriderExtraBold.woff2")
    format("woff2");
  font-weight: 800;
  font-style: normal;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

ul, li {
  list-style: none;
}

a {
  text-decoration: none;
  color: inherit;
}

body {
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
`;

const Container = styled.div`
  background: ${({ theme }) => theme.boardColor};
  position: relative;
  width: 80vw;
  min-width: 800px;
  min-height: 800px;
  padding: 100px;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
  > h2 {
    font-family: "KartriderExtraBold";
    font-size: 32px;
    letter-spacing: 2px;
    margin-bottom: 20px;
  }
  .theme_toggle {
    position: absolute;
    top: 100px;
    right: 100px;
    padding: 6px;
    border-radius: 10px;
    background: ${({ theme }) => theme.toggleBgColor};
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    svg {
      opacity: 0.75;
    }
  }
  .list_icon {
    position: absolute;
    bottom: 100px;
    right: 100px;
    min-width: 36px;
    min-height: 36px;
    padding: 6px;
    border-radius: 10px;
    background: ${({ theme }) => theme.toggleBgColor};
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    svg {
      opacity: 0.75;
    }
  }
`;

const Boards = styled.div`
  width: 100%;
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
`;

const App = () => {
  const captureRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useRecoilState(isDarkAtom);
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;

    if (destination?.droppableId === source.droppableId) {
      setToDos((oldToDos) => {
        const boardCopy = [...oldToDos[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination.index, 0, taskObj);
        return {
          ...oldToDos,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (destination?.droppableId !== source.droppableId) {
      setToDos((oldToDos) => {
        const sourceBoard = [...oldToDos[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...oldToDos[destination.droppableId]];

        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, taskObj);
        return {
          ...oldToDos,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };

  const handleCapture = async () => {
    if (!captureRef.current) return;

    await document.fonts.ready;

    const canvas = await html2canvas(captureRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: true,
      ignoreElements: (element) => {
        return element.classList.contains("html2canvas-ignore");
      },
    });

    const image = canvas.toDataURL("image/png", 1.0);

    const link = document.createElement("a");
    link.href = image;
    link.download = "capture.png";
    link.click();
  };

  return (
    <>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyle />
        <DragDropContext onDragEnd={onDragEnd}>
          <Container ref={captureRef}>
            <h2>Frontend Developer Todo List</h2>
            <div
              className="theme_toggle html2canvas-ignore"
              onClick={() => setIsDark(!isDark)}
            >
              {isDark ? (
                <FiSun size={24} color="##BEC1CE" />
              ) : (
                <FaRegMoon size={24} color="##BEC1CE" />
              )}
            </div>
            <div
              className="list_icon html2canvas-ignore"
              onClick={handleCapture}
            >
              <LuDownload size={21} />
            </div>
            <Boards>
              {Object.keys(toDos).map((boardId) => (
                <Board key={boardId} toDos={toDos[boardId]} boardId={boardId} />
              ))}
            </Boards>
          </Container>
        </DragDropContext>
      </ThemeProvider>
    </>
  );
};

export default App;
