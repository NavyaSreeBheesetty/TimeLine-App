import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { Menu,Icon} from 'semantic-ui-react'
import { logout } from '../functions/auth';
import Cookies from 'universal-cookie';
import { setAdmin, setLogins } from '../reducers/globalStates';
import "./navbar.css";
import { set } from 'lodash';



const cookie=new Cookies();
const isAdmin = cookie.get("role") === "true";
const username = cookie.get("username");


export default function Navbar() {
    const dispatcher = useDispatch();
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState("home")
  
    
    
    const destroySession = async () => {
        let flag = await logout();
        if (flag === true) {
            dispatcher(setLogins(false, null), setAdmin(false));
            navigate("/timeline/authenticate");
        } else {
            return false;
        }
    };
    const State = useSelector((state) => state.globalStates);
    
    const handleItemClick = (e, {name }) =>
    { setActiveItem(name);
        localStorage.setItem("active", name);}
        
var t=localStorage.getItem("active");
useEffect(()=>
{
    setActiveItem(t)
},[t])

    return (
        <div style={{ height: "100vh", backgroundColor: "#2F4F4F" }}>
            <Menu pointing secondary vertical style={{width:'250px', height: "100%", fixed:"top"}}>
            {/* <Menu.Item>
                    <img src="https://citrixready.citrix.com/content/dam/ready/partners/xe/xenovus-inc/backflipt-ios/backflipt-ios-images.png" alt="Logo" style={{marginLeft:"25px", height: '100px', marginBottom: '10px'}} />
                </Menu.Item> */}


                
<Menu.Menu position="right" className='userMenu' style={{marginLeft:"65px", height: '55px', marginBottom: '10px'}}>
       
       <Icon name="user circle"  style={{size:"40%"}}/>
       {username}

       </Menu.Menu>
                    
                    <div style={{backgroundColor:'#2F4F4F'}}></div>
                {State.loggedIn ? (<>
                    <Menu.Item className="navBarStyle"
                        name='Home'
                        active={activeItem === 'Home' ? 'active':""}
                        as={Link}
                        to="/"
                        onClick={handleItemClick}
                    >
                        
                        <Icon name='home icon' size='large' />
                          Home
                      </Menu.Item>
{/*                        
                    <Menu.Item className="navBarStyle"
                        name='ToDo'
                        as={Link}
                        to="/ToDo"
                        active={activeItem === 'ToDo'}
                        onClick={handleItemClick}
                    >
                         <Icon name='clock outline' size='large' />
                          TO DO
                      </Menu.Item> */}


<Menu.Item
 className="navBarStyle"
//   className={`navBarStyle ${activeItem === 'ToDo' ? 'menu-item-hovered' : ''}`}


  name='ToDo'
  as={Link}
  to="/ToDo"
  active={activeItem === 'ToDo'}
  onClick={handleItemClick}
>
  <Icon name='clock outline' size='large' />
  TO DO
</Menu.Item>



{/* <Menu.Item className="navBarHiddenStyle"
                        name='TimeChart'
                        as={Link}
                        to="/TimeChart"
                        active={activeItem === 'TimeChart'}
                        onClick={handleItemClick}
                    >
                         <Icon name='clock outline' size='large' />
                          TimeChart
                      </Menu.Item>  */}







                <Menu.Item className="navBarStyle"
        name='ExpenseTracker'
        as={Link}
        to='/ExpenseTracker'
        active={activeItem === 'ExpenseTracker'}
        onClick={handleItemClick}
      >
        <Icon name='rupee sign' size='large' />
        Expense Tracker
      </Menu.Item>

                  <Menu.Item className="navBarStyle"
                        name='BugReport'
                        as={Link}
                        to="/BugReport"
                        active={activeItem === 'BugReport'}
                        onClick={handleItemClick}
                    >


                     <Icon name='bug' size='large' />
                          BugReport
                              </Menu.Item>

                    
                  <Menu.Item className="navBarStyle"
                        name='LeaveReport'
                        as={Link}
                        to="/LeaveReport"
                        active={activeItem === 'LeaveReport'}
                        onClick={handleItemClick}
                    >
                          <Icon name='calendar alternate outline' size='large' />
                          LeaveReport
                              </Menu.Item>

     
                              {/* <Menu.Item className="navBarStyle"
                        name='InventoryReport'
                        as={Link}
                        to="/InventoryReport"
                        active={activeItem === 'InventoryReport'}
                        onClick={handleItemClick}
                    >
                          <Icon name='laptop' size='large' />
                          InventoryReport
                              </Menu.Item> */}



                    <Menu.Item className="navBarStyle"
                        name='Logout'
                        position="right"
                        active={activeItem === 'Logout'}
                        onClick={destroySession}
                    >
                          <Icon name='sign-out' size='large' />
                          Logout
                              </Menu.Item>
                </>) : (<>
                    <Menu.Item 
                        name='Login'
                        position='right'
                        active={activeItem === 'Login'}
                        as={Link}
                        to="/login"
                        onClick={handleItemClick}
                    />
                </>)}
            </Menu>
        </div>
    )
}




