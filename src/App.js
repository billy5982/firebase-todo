import Home from './Components/Main/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { authService } from './firebase';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';

import { setUser, clearUser } from './redux/actions/user_actions';

function App() {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);
  // 인증서버에서 로그인한 사용자에 대한 정보를 확인할 수 있음.
  // 근데 회원가입 했을 때도 해당 user가 반응한다? , []로 줬는데 로그인할 때도 반응한다?

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      // user에 정보가 있으면 로그인 된 상태
      navigate('/login');
      dispatch(clearUser());

      if (user) {
        //로그인 페이지에서 채팅 페이지로 이동해야함
        navigate('/'); // chatpage로 이동
        //유저 정보를 리덕스 스토어에 넣을 것임.
        dispatch(setUser(user));
      } else {
        navigate('/login');
        dispatch(clearUser());
      }
    });
  }, []);
  if (isLoading) {
    return <div>...loading</div>;
  } else {
    return (
      <div className='App w-[100vw] h-[100vh] bg-[#CFC9C3] flex justify-center items-center font-Jua'>
        <div className='w-[1260px] h-[820px] bg-[#FBF6F2] bg-opacity-80 rounded-[60px] drop-shadow-xl'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;
