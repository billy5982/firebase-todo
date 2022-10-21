import { BsFillTrashFill } from 'react-icons/bs';
import { VscDebugStart } from 'react-icons/vsc';
import { AiFillCheckCircle } from 'react-icons/ai';
import { getDatabase, ref, remove, update } from 'firebase/database';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  background-image: ${({ url }) => `url(${url})` || 'none'};
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;

export default function List({ item }) {
  // let year = [...time].slice(0, 4).join("");
  // let month = [...time].slice(4, 6).join("");
  // let day = [...time].slice(6).join("");
  // time = `${year}/${month}/${day}`;
  console.log(item);
  const removeData = (id) => {
    remove(ref(getDatabase(), `todos/${id}`));
  };

  const goProgress = (id) => {
    update(ref(getDatabase(), `todos/${id}`), {
      do: 'progress',
    });
    window.location.replace('/');
  };

  const goDone = (id) => {
    update(ref(getDatabase(), `todos/${id}`), {
      do: 'done',
    });
    window.location.replace('/');
  };

  return (
    <div className='bg-white w-[240px] h-[120px] mb-3 rounded-[15px] flex flex-col p-3 drop-shadow-xl'>
      <div className='flex justify-between'>
        {item.timeStamp > 7 && <div className='h-[7px] w-[92px] bg-green-100 p-1'></div>}
        {item.timeStamp > 2 && item.timeStamp < 7 && <div className='h-[7px] w-[92px] bg-yellow-100 p-1'></div>}
        {item.timeStamp <= 2 && <div className='h-[7px] w-[92px] bg-red-100 p-1'></div>}
      </div>
      <div className='font-bold mt-2'>{item.name}</div>
      <div className='flex mt-1 mb-2 items-center'>
        {/* 작성자 정보 */}
        {item.createdBy && (
          <>
            <ProfileContainer url={item.createdBy.image} />
            <div className=''>{item.createdBy.name}</div>
          </>
        )}
      </div>
      <div className='self-end w-full flex justify-between'>
        <div className='font-bold text-[#979492]'>{item.timeFin}</div>
        {/* 시작 버튼이라면 지우기 + doing */}
        {item.do === 'start' && (
          <div className='flex p-1'>
            <BsFillTrashFill className='cursor-pointer mr-2' onClick={() => removeData(item.id)} />
            <VscDebugStart
              className='cursor-pointer'
              onClick={() => {
                goProgress(item.id);
              }}
            />
          </div>
        )}

        {item.do === 'progress' && (
          <div className='flex p-1'>
            <BsFillTrashFill className='cursor-pointer mr-2' onClick={() => removeData(item.id)} />
            <AiFillCheckCircle
              className='cursor-pointer'
              onClick={() => {
                goDone(item.id);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
