import { useState } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'
import InputMask from 'react-input-mask';
import { FiUser } from 'react-icons/fi'

import { db } from '../../services/firebaseConnection'
import { addDoc, collection } from 'firebase/firestore'

import { toast } from 'react-toastify'

export default function Clients(){
  const [name, setName] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [email, setEmail] = useState('')

  async function handleRegister(e){
    e.preventDefault();

    if(name !== '' && cnpj !== '' && email !== ''){
        await addDoc(collection(db, "clients"), {
          nomeFantasia: name,
          cnpj: cnpj,
        email:email
        })
        .then(() => {
          setName('')
          setCnpj('')
          setEmail('')
          toast.success("Empresa registrada!")
        })
        .catch((error) => {
          console.log(error);
          toast.error("Erro ao fazer o cadastro.")
        })

    }else{
      toast.error("Preencha todos os campos!")
    }

  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Clientes">
          <FiUser size={25} />
        </Title>

        <div className="container">
       
          <form className="form-profile" onSubmit={handleRegister}>
              <label>Nome fantasia</label>
              <input
                type="text"
                placeholder="Nome da empresa"
                value={name}
                onChange={(e) => setName(e.target.value) }
              />

              <label>CNPJ</label>
              <InputMask   
              mask="99.999.999/9999-99"
              value={cnpj}  
             placeholder='11.111.111/1111-11'
              onChange={(e)=> setCnpj(e.target.value)}
                      
               />

              <label>Endereço</label>
              <input
                type="text"
                placeholder="Endereço da empresa"
                value={email}
                onChange={(e) => setEmail(e.target.value) }
              />

              <button type="submit">
                Salvar
              </button>
          </form>
        </div>

      </div>

    </div>
  )
}