import { slide as Menu } from "react-burger-menu";

import "../styles/Sidebar.css";

type SidebarProps = {
  pageWrapId: string;
  outerContainerId: string;
};

function Sidebar({ pageWrapId, outerContainerId }: SidebarProps) {

  // source: https://github.com/negomi/react-burger-menu
  var styles = {
    bmBurgerButton: {
      position: "fixed",
      width: "36px",
      height: "30px",
      left: "36px",
      top: "36px",
    },
    bmBurgerBars: {
      background: "#373a47",
    },
    bmBurgerBarsHover: {
      background: "#a90000",
    },
    bmCrossButton: {
      height: "24px",
      width: "24px",
    },
    bmCross: {
      background: "#bdc3c7",
    },
    bmMenuWrap: {
      position: "fixed",
      height: "100%",
    },
    bmMenu: {
      // background: "#373a47",
      background: "#f0f0f2",

      marginLeft: "-10px",
      marginTop: "-5px",

      padding: "2.5em 1.5em 0",
      fontSize: "1.15em",
    },
    bmMorphShape: {
      fill: "#373a47",
    },
    bmItemList: {
      color: "#b8b7ad",
      padding: "0.8em",
    },
    bmItem: {
      display: "inline-block",
    },
    bmOverlay: {
      background: "rgba(0, 0, 0, 0.3)",
    },
  };

  return (
    <Menu
      pageWrapId={pageWrapId}
      outerContainerId={outerContainerId}
      styles={styles}
    >
      <a className="menu-item" href="/">
        Home
      </a>
      <br />
      <a className="menu-item" href="/login">
        Login
      </a>
      <br />
      <a className="menu-item" href="/signup">
        Sign-up
      </a>
    </Menu>
  );
}

export default Sidebar;
