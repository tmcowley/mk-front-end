import { useNavigate } from "react-router-dom";

import { signOut as APIsignOut } from '../utils/api-calls'

function Signout() {
  const navigate = useNavigate();

  setTimeout(() => {
    APIsignOut(
      (response) => {
        navigate("/");
      }
    )
  }, 200);

  return <h1 className="centre">Signing you out</h1>;
}

export default Signout;
