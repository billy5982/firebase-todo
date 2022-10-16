import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Dropdown from "react-bootstrap/Dropdown";
import { useRef } from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { clearUser, setPhotoURL } from "../../../redux/actions/user_actions";
import { useNavigate } from "react-router-dom";
import { FcTodoList } from "react-icons/fc";
import { AiOutlinePoweroff } from "react-icons/ai";
import {
  ref as strRef,
  uploadBytesResumable,
  getStorage,
  getDownloadURL,
} from "firebase/storage";

import { getDatabase, ref, update } from "firebase/database";

const ProfileContainer = styled.div`
  background-image: ${({ url }) => url || "none"};
  width: 35px;
  height: 35px;
  border-radius: 50%;
`;

export default function UserPanel() {
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(getAuth());
    dispatch(clearUser());
    navigate("/");
  };
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const metaData = { contentType: file.type };
    try {
      let uploadTask = await uploadBytesResumable(
        strRef(getStorage(), `user_image/${user.uid}`),
        file,
        metaData
      );
      let downloadUrl = await getDownloadURL(uploadTask.ref);
      await updateProfile(getAuth().currentUser, {
        photoURL: downloadUrl,
      });
      dispatch(setPhotoURL(downloadUrl));
      update(ref(getDatabase(), "users/" + user.uid), {
        image: downloadUrl,
      });
    } catch (err) {
      console.log((err) => err);
    }
  };

  const changeProfile = () => {
    inputRef.current.click();
  };
  const inputRef = useRef(null);
  return (
    <div className="flex flex-col h-full">
      <div className="flex">
        <FcTodoList className="h-8 w-8" />
        <h3 className="mt-[3px] ml-2"> Todo App</h3>
      </div>
      <div className="w-[130px] h-[35px] flex items-center mt-2 ">
        {user && <ProfileContainer url={`url(${user.photoURL})`} />}
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/jpeg, image/png"
          onChange={handleUploadImage}
        />
        <Dropdown>
          <Dropdown.Toggle
            className="bg-transparent border-0 "
            id="dropdown-basic"
            variant="light"
          >
            {user && user.displayName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={changeProfile}>
              프로필 사진 변경
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>로그아웃 </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="flex h-full w-full items-end mb-10 pr-5 justify-end">
        <AiOutlinePoweroff
          className="h-12 w-12 cursor-pointer"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}
