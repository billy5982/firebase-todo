import {
  getDatabase,
  onChildAdded,
  onChildRemoved,
  ref,
  update,
} from "firebase/database";
import { useEffect, useState } from "react";
import DoPanel from "./DoPanel";

export default function MainWindow() {
  const [startDo, setStart] = useState([]);
  const [progressDo, setProgress] = useState([]);
  const [finDo, setFin] = useState([]);
  const todoRef = ref(getDatabase(), "todos/");

  const addTodos = () => {
    let start = [];
    let progress = [];
    let fin = [];
    onChildAdded(todoRef, (data) => {
      let trueData = data.val();
      if (trueData.do === "start") {
        start.push(trueData);
        start.sort((a, b) => a.timeStamp - b.timeStamp);
        setStart([...start]);
      } else if (trueData.do === "progress") {
        progress.push(trueData);
        fin.sort((a, b) => a.timeStamp - b.timeStamp);
        setProgress([...progress]);
      } else if (trueData.do === "done") {
        fin.push(trueData);
        fin.sort((a, b) => a.timeStamp - b.timeStamp);
        setFin([...fin]);
      }
    });

    onChildRemoved(todoRef, (data) => {
      //지워진 데이터 => data
      let trueData = data.val();
      if (trueData.do === "start") {
        let index = start.findIndex((data) => data.id === trueData.id);
        if (index === 0 && progress.length === 1) {
          start = [];
          setStart([]);
        } else if (index !== -1) {
          start.splice(index, 1);
          start.sort((a, b) => a.timeStamp - b.timeStamp);
          setStart([...start]);
        }
      } else if (trueData.do === "progress") {
        let index = progress.findIndex((data) => data.id === trueData.id);
        if (index === 0 && progress.length === 1) {
          progress = [];
          setProgress([]);
        } else if (index !== -1) {
          progress.splice(index, 1);
          progress.sort((a, b) => a.timeStamp - b.timeStamp);
          setProgress([...progress]);
        }
      } else if (trueData.do === "done") {
        let index = fin.findIndex((data) => data.id === trueData.id);
        if (index === 0 && fin.length === 1) {
          fin = [];
          setFin([]);
        } else if (index !== -1) {
          fin.splice(index, 1);
          fin.sort((a, b) => a.timeStamp - b.timeStamp);
          setFin([...fin]);
        }
      }
    });
  };

  useEffect(() => {
    addTodos();
  }, []);

  return (
    <div className="h-full w-full flex">
      <DoPanel title={"To Start"} data={startDo} className="w-1/3" />
      <DoPanel title={"In Progress"} data={progressDo} className="w-1/3" />
      <DoPanel title={"Done"} data={finDo} className="w-1/3" />
    </div>
  );
}
