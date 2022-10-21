import { getDatabase, onChildAdded, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  background-image: ${({ url }) => url || 'none'};
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin: -5px;
  border: 2px solid white;
  &:hover {
    content: 'hi';
  }
`;

export default function Members() {
  const userRef = ref(getDatabase(), 'users');
  const [users, setUsers] = useState([]);
  const [showName, setShowName] = useState('');
  const addUsersListener = () => {
    let usersArray = [];
    onChildAdded(userRef, (data) => {
      //data.key로 접근하면 users 데이터 베이스 안에있는 uid값에 접근할 수 있음
      let user = data.val();
      usersArray.push(user);
      setUsers([...usersArray]);
    });
  };

  const mouseOver = (userName) => {
    setShowName(userName);
  };
  useEffect(() => {
    addUsersListener();
  }, []);

  return (
    <>
      <div className='flex flex-col'>
        <div className='text-right mb-1 font-extrabold'>Members</div>
        <div className='flex'>{users.length !== 0 && users.map((user) => <ProfileContainer url={`url(${user.image})`} key={user.image} onMouseOver={() => mouseOver(user.name)} onMouseOut={() => setShowName('')} />)}</div>
        {showName && <p className='mt-2 pl-1 pr-1 text-right bg-white rounded'>{showName}</p>}
      </div>
    </>
  );
}
