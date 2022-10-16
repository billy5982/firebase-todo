import CreateHeader from "./CreateHeader";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { child, getDatabase, push, ref, update } from "firebase/database";
import { useSelector } from "react-redux";
import MainWindow from "./MainWindow";

export default function MainPanel() {
  const user = useSelector((state) => state.user.currentUser);
  const [show, setShow] = useState(false);
  const todoRef = ref(getDatabase(), "todos");
  const [formValue, setFormValue] = useState({
    name: "",
    description: "",
    finDate: "",
  });

  const formChange = (e) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value,
    });
  };

  const onClick = () => {
    setShow(!show);
  };
  const isFormValid = (nam, des) => nam && des;

  const handleSubmit = (e) => {
    if (isFormValid(formValue.name, formValue.description)) {
      addTodos();
    }
  };

  const getFormatDate = (date) => {
    let year = date.getFullYear();
    let month = 1 + date.getMonth();
    month = month >= 10 ? month : "0" + month;
    let day = date.getDate();
    day = day >= 10 ? day : "0" + day;
    return `${year}${month}${day}`;
  };

  const addTodos = async () => {
    const { name, description } = formValue;
    let finDate = formValue.finDate.split("-").join("");

    const key = push(todoRef).key;
    const now = getFormatDate(new Date());

    const newTodo = {
      id: key,
      name,
      description,
      createdBy: {
        name: user.displayName,
        image: user.photoURL,
      },
      timeStamp: Number(finDate - now),
      timeNow: now,
      timeFin: finDate,
      do: "start",
      // start, Progress, Done
    };
    try {
      //데이터 베이스에 업데이트 ?? chatRoomRef에 key라는 row을 제작 row의 값(상세정보)
      //newChatRoom 데이터를 넣을 것임
      await update(child(todoRef, key), newTodo);
      //state 초기화
      setFormValue({
        name: "",
        description: "",
        finDate: "",
      });
      // 모달창 닫아주기
      setShow(false);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div className="p-2 h-full">
      <div className="pt-16 pl-20 h-full">
        <CreateHeader onClick={onClick} />
        <MainWindow onClick={onClick} />
      </div>
      <Modal show={show} onHide={onClick}>
        <Modal.Header closeButton>
          <Modal.Title>Create a Todo</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ display: "flex", flexDirection: "column" }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Todo 내용</Form.Label>
              <Form.Control
                name="name"
                value={formValue.name}
                type="text"
                placeholder="Enter a chat todo"
                onChange={formChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Todo 설명</Form.Label>
              <Form.Control
                name="description"
                value={formValue.description}
                type="text"
                placeholder="Enter a todo description"
                onChange={formChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>완료 일자</Form.Label>
              <Form.Control
                name="finDate"
                value={formValue.finDate}
                type="date"
                placeholder="Enter a todo description"
                onChange={formChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClick}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
