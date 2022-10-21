import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import md5 from 'md5';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { Link } from 'react-router-dom';

export default function Register() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });
  const [errorFromsubmit, setErrorFromSubmit] = useState('');
  const [submitStop, setSubmitStop] = useState(false);
  const password = useRef(null);
  password.current = watch('password');

  const onSubmit = async (data) => {
    console.log('click');
    try {
      setErrorFromSubmit(true);
      let createdUser = await createUserWithEmailAndPassword(getAuth(), data.email, data.password);
      await updateProfile(getAuth().currentUser, {
        displayName: data.name,
        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`,
      });
      await set(ref(getDatabase(), 'users/' + createdUser.user.uid), {
        name: createdUser.user.displayName,
        image: createdUser.user.photoURL,
      });

      setSubmitStop(false);
    } catch (error) {
      setSubmitStop(false);
      setErrorFromSubmit(error.message);
      setTimeout(() => {
        setErrorFromSubmit(''); // 5초 지난 후 에러가 사라짐.
      }, 5000);
    }
  };

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='w-[440px]  bg-[#FCF7F3] flex flex-col items-center rounded-3xl drop-shadow-xl'>
        <div className='text-[24px] font-bold text-center mt-[17px] text-[#979492]'>Register</div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-[10px] mt-[20px]'>
          <div className='flex flex-col'>
            <label htmlFor='email' className='text-[16px] text-[#979492] font-bold'>
              Email
            </label>
            <input type='email' className='w-[285px] h-[34px] border-2 border-gray-500 rounded-[5px] pl-[5px]' id='email' placeholder='Email' {...register('email', { required: true, pattern: /^\S+@\S+$/i })} />
            {errors.email && errors.email.type === 'required' && <p className="text-[#bf1650] before:inline content-['⚠ ']">이메일을 입력해주세요</p>}
            {errors.email && errors.email.type === 'pattern' && <p className="text-[#bf1650] before:inline content-['⚠ ']">이메일을 형식을 맞춰 입력해주세요</p>}
          </div>
          <div className='flex flex-col'>
            <label htmlFor='name' className='text-[16px] text-[#979492] font-bold'>
              Name
            </label>
            <input type='text' id='name' className='w-[285px] h-[34px] border-2  border-gray-500 rounded-[5px] pl-[5px]' placeholder='Name' {...register('name', { required: true, maxLength: 10 })} />
            {errors.name && errors.name.type === 'required' && <p className="text-[#bf1650] before:inline content-['⚠ ']">이름을 입력해주세요</p>}
            {errors.name && errors.name.type === 'maxLength' && <p className="text-[#bf1650] before:inline content-['⚠ ']">최대 10자까지 가능합니다.</p>}
          </div>
          <div className='flex flex-col'>
            <label htmlFor='password' className='text-[16px]  font-bold text-[#979492] text-[#979492]'>
              Password
            </label>
            <input type='password' id='password' className='w-[285px] h-[34px] border-2 border-gray-500 rounded-[5px] pl-[5px]' placeholder='Password' {...register('password', { required: true, minLength: 6 })} />
            {errors.password && errors.password.type === 'required' && <p className="text-[#bf1650] before:inline content-['⚠ ']">패스워드를 입력해주세요</p>}
            {errors.password && errors.password.type === 'minLength' && <p className="text-[#bf1650] before:inline content-['⚠ ']">최소 6글자 이상이여야 합니다.</p>}
          </div>
          <div className='flex flex-col'>
            <label htmlFor='passwordConfirm' className='text-[16px] text-[#979492] font-bold '>
              PasswordConfirm
            </label>
            <input
              type='password'
              id='passwordConfirm'
              className='w-[285px] h-[34px] border-2 border-gray-500 pl-[5px] rounded-[5px] pl-[5px]'
              placeholder='PasswordConfirm'
              {...register('passwordConfirm', {
                required: true,
                validate: (value) => value === password.current,
              })}
            />
            {errors.passwordConfirm && errors.passwordConfirm.type === 'validate' && <p className="text-[#bf1650] before:inline content-['⚠ ']">패스워드가 일치하지 않습니다</p>}
            <input type='submit' value={'회 원 가 입'} className='mt-[20px] mb-4 w-[200px] h-[40px] bg-[#CFC9C3] self-center text-white font-semibold rounded-[10px] ' />
          </div>
          {/* <input type="submit" value={"SUBMIT"} disabled={submitStop} /> */}
          {errorFromsubmit ? <p className="text-[#bf1650] before:inline content-['⚠ ']">{errorFromsubmit}</p> : null}
        </form>
        <Link to='/login' className='mb-4 text-[16px] text-[#979492] font-bold'>
          이미 아이디가 있다면...
        </Link>
      </div>
    </div>
  );
}
