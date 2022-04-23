import { slide as Menu } from "react-burger-menu"

import "../styles/Sidebar.css"

import { styles } from '../constants/constants'

type SidebarProps = {
  pageWrapId: string;
  outerContainerId: string;
  isLoggedIn: boolean;
};

function Sidebar({ pageWrapId, outerContainerId, isLoggedIn }: SidebarProps) {
  
  return (
    <>
      <div hidden={isLoggedIn}>
        <Menu
          pageWrapId={pageWrapId}
          outerContainerId={outerContainerId}
          styles={styles}
        >
          <a className="menu-item" href="/">
            Home
          </a>
          <br />
          <a className="menu-item" href="/sign-in">
            Sign-in
          </a>
          <br />
          <a className="menu-item" href="/sign-up">
            Sign-up
          </a>
        </Menu>
      </div>
      <div hidden={!isLoggedIn}>
        <Menu
          pageWrapId={pageWrapId}
          outerContainerId={outerContainerId}
          styles={styles}
        >
          <a className="menu-item" href="/learn">
            Home
          </a>
          <br />
          <a className="menu-item" href="/sign-out">
            Sign-out
          </a>
          <br />
          <a className="menu-item" href="/display-user-code">
            See Code
          </a>
        </Menu>
      </div>
    </>
  );
}

export default Sidebar;
