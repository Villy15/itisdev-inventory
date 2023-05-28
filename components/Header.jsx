import { IoNotificationsOutline } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";

const Header = () => {
  return (
    <div className='header'>
        <h1>Dashboard</h1>
        <div className="right-side">
            <IoNotificationsOutline className='icon'/>
            <div className="user">
                <RxAvatar className='icon'/>
                <span>Manager</span>
            </div>
        </div>
    </div>
  )
}

export default Header