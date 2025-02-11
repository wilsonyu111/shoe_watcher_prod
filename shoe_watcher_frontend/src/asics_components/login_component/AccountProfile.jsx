import * as React from "react";
import LogedInItem from "./LogedInItem";
import { useSelector } from "react-redux";
import { selectLoginState } from "../features/auth/authSlice";
import { getJwtClaims } from "../HelperFunctions";

function AccountProfile() {
  
  const [helloName, setHelloName] = React.useState(<></>);
  const authState = useSelector(selectLoginState);
  React.useEffect(() =>{
    let cred = getJwtClaims();
    if (cred.user !== "" && authState)
    {
      setHelloName(<><div className="logged_in_greeting_name">Hello {cred.user}</div> </>)
    }
    else{
      setHelloName(<></>)
    }
  }, [authState])
  return <div className="logged_in_greeting">
    
    <LogedInItem authStatus={authState}/>
    {helloName}
    </div>;
}

export default AccountProfile;
