import React, { useState,  useEffect, MouseEvent } from "react";
import { gql } from '@apollo/client'
import { useLazyQuery, useMutation } from "@apollo/react-hooks";

const GET_USER = gql`
  query($name: String!) {
    user(name: $name) {
      name
      password
    }
  }
`;

const ADD_USER = gql`
  mutation addUser($name: String!, $password: String!){
    addUser(name: $name, password: $password) {
      name
      password
    }
  }
`;

function Contents()  {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [prevname, setPrevname] = useState('');
  const [active,setActive] = useState(false);
  const [reg,setRegister] = useState(false);
  const [log,setLogin] = useState(false);

  const [getUser, { loading: getloading, error: geterror, data: getdata }] = useLazyQuery(GET_USER, { fetchPolicy: 'network-only' });
  const [createUser, { loading: postloading, error: posterror, data: postdata }] = useMutation(ADD_USER);

  useEffect( () => {
    if (username===prevname) {
      setPrevname('');
      return;
    }
    if (!getdata) return;
    userControl();
  },[getdata]);

  if (getloading || postloading) return <div>Loading...</div>
  if (geterror || posterror) return <div>Error :</div>

  const userControl = async () => {
    let message = '';
    if(getdata.user && getdata.user.name!=null) {
      if (log) {
        if (getdata.user.password===password) {
          message = 'Your password has been verified.';
        } else {
          message = 'Invalid password...';
        };
      } else {
        message = 'User already exist.';
      };
    } else {
      if (reg) {
        let res = await createUser({ variables: { name: username, password: password}});
        if (res) {
          message = 'User ' + username + '  registred.';
        }
      } else {
        message = 'User not found.';
      };
    };
    if (message>'') alert(message);
    setRegister(false);
    setLogin(false);
    setPrevname(username);
    setUsername('');
    setPassword('');
  }

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setActive(false);
    username.trim();
    password.trim();
    if (username==='' || password==='') {
      alert('Empty username or password.');
      return;
    }
    if (username===prevname) {
      await getUser({ variables: { name: ''}});
    }
    await getUser({ variables: { name: username }});
  }

  const onRegister = () => {
    setActive(true);
    setRegister(true);
  };

  const onLogin = () => {
    setActive(true);
    setLogin(true);
  };

  return (
    <div>
      <button onClick={onRegister} disabled= {active}>Register</button>
      <br/> <br/>
      <button onClick={onLogin} disabled= {active}>Login</button>
      <br/> <br/>
      <input type="text" placeholder= "Username" value={username} disabled= {!active} onChange={e => setUsername(e.target.value)}/>
      <br/> <br/>
      <input type="text" placeholder= "Password" value={password} disabled= {!active} onChange={e => setPassword(e.target.value)}/>
      <br/> <br/>
      <button onClick={handleSubmit} disabled= {!active}>
        Click me!
      </button>
    </div>
  )
}

export default Contents;
