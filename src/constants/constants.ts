
// keyboard-sides key sets
export const leftSide = new Set([
    'q', 'w', 'e', 'r', 't',
    'a', 's', 'd', 'f', 'g',
    'z', 'x', 'c', 'v', 'b'
])
export const rightSide = new Set([
    'y', 'u', 'i', 'o', 'p',
    'h', 'j', 'k', 'l',
    'n', 'm'
])

// source: https://github.com/negomi/react-burger-menu
export var styles = {
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