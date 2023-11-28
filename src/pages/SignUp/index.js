import { useState, useContext  } from 'react'
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom'

import { AuthContext } from '../../contexts/auth'
import { AiFillEyeInvisible, } from "react-icons/ai";
import { MdVisibility } from "react-icons/md";

export default function SignUp(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const [visiblePassword,setVisibePassword] = useState(false)
  const { signUp, loadingAuth } = useContext(AuthContext);

  async function handleSubmit(e){
    e.preventDefault();

    if(name !== '' && email !== '' && password !== ''){
     await signUp(email, password, name)
    } else{
      alert('Preencha os campos vazios')
    }

  }
  function handleVisible(){
    setVisibePassword(!visiblePassword)
    console.log(visiblePassword)
  }

  return(
    <div className="container-center">
      <div className='Background'></div>
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo do sistema de chamados" />
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Nova conta</h1>
          <input 
            type="text" 
            placeholder="Seu nome"
            value={name}
            onChange={ (e) => setName(e.target.value) }
          />

          <input 
            type="text" 
            placeholder="Digite o email"
            value={email}
            onChange={ (e) => setEmail(e.target.value) }
          />

<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
    <input 
            type={ visiblePassword ? 'password' : 'text' }
            placeholder="Digite sua senha"
            value={password}
            onChange={ (e) => setPassword(e.target.value) }
         
         />
       
          
          {
            visiblePassword ? (
              <div onClick={handleVisible} style={{position:'absolute', right:60,marginBottom:10,cursor:'pointer'}}> 
              <AiFillEyeInvisible size={24}/>
              </div>
            ) : (
<div onClick={handleVisible} style={{position:'absolute', right:60,marginBottom:10,cursor:'pointer'}}> 
             <MdVisibility size={24}/> 
              </div>
      
            )
          }
        
           </div>

          <button type="submit">
            {loadingAuth ? 'Carregando...' : 'Cadastrar'}
          </button>
        </form>

        <Link to="/">Já possui uma conta? Faça login</Link>

      </div>
    </div>
  )
}