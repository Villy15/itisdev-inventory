import { IoNotificationsOutline } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { useRouter } from 'next/router';

const Header = ({user, page}) => {
  const router = useRouter();

  async function logout() {
    await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    router.push('/login');
  }

  return (
    <div className='header'>
        <h1>{page}</h1>
        <div className="right-side">
            <IoNotificationsOutline className='icon'/>
            <div className="user">
                <RxAvatar className='icon'/>
                <span>{user.role}</span>
            </div>
            {
              user.role !== "Guest" && <button onClick={logout}>Logout</button>
            }
        </div>
    </div>
  )
}

export default Header