import { useContext, useEffect, useState } from 'react'
import {AuthContext} from '../../contexts/auth'

import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from 'react-icons/fi'

import { Link } from 'react-router-dom'
import { collection, getDocs, orderBy, limit, startAfter, query,where} from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'

import { format } from 'date-fns'
import Modal from '../../components/Modal'

import './dashboard.css'

const listRef = collection(db, "called")

export default function Dashboard(){
  const { logout,user } = useContext(AuthContext);

  const [calleds, setCalleds] = useState([])
  const [loading, setLoading] = useState(true);

  const [isEmpty, setIsEmpty] = useState(false)
  const [lastDocs, setLastDocs] = useState()
  const [loadingMore, setLoadingMore] = useState(false);

  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState()


  useEffect(() => {
    async function loadCalleds(){
      if (user) {
        const q = query(
          listRef,
          where('userId', '==', user.uid), // Filtra os chamados pelo userId do usuário autenticado
          orderBy('created', 'desc'),
          limit(7)
        );
  
        const querySnapshot = await getDocs(q)
        .then((snapshot)=>{
          let list = []
          snapshot.forEach((doc)=> {
            list.push({
              id: doc.id,
              subject: doc.data().subject,
              client: doc.data().client,
              clienteId: doc.data().clienteId,
              created: doc.data().created,
              createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
              status: doc.data().status,
              desc: doc.data().desc,
              userId : doc.data().userId
            })
          

            
          })
          const lastDoc = snapshot.docs[snapshot.docs.length - 1] // Pegando o ultimo item

            setCalleds(list)
          console.log(list)
          console.log(lastDoc)
         
          
        
        })
        

       
  
        setLoading(false);
      }
      
    }
  
    loadCalleds();
  
    return () => { }
  }, [user])

  
  async function handleMore() {
    setLoadingMore(true);
  
    try {
      let q;
  
      if (lastDocs) {
        q = query(
          listRef,
          where('userId', '==', user.uid),
          orderBy('created', 'desc'),
          startAfter(lastDocs),
          limit(7)
        );
      } else {
        q = query(
          listRef,
          where('userId', '==', user.uid),
          orderBy('created', 'desc'),
          limit(7)
        );
      }
  
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const newCalleds = [];
        querySnapshot.forEach((doc) => {
          newCalleds.push({
            id: doc.id,
            subject: doc.data().subject,
            client: doc.data().client,
            clienteId: doc.data().clienteId,
            created: doc.data().created,
            createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
            status: doc.data().status,
            desc: doc.data().desc,
            userId: doc.data().userId
          });
        });
  
        const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
  
        setCalleds((prevCalleds) => [...prevCalleds, ...newCalleds]);
        setLastDocs(lastDoc);
      } else {
        setIsEmpty(true);
      }
    } catch (error) {
      console.error('Erro ao buscar mais chamados:', error);
      // Trate o erro conforme necessário
    } finally {
      setLoadingMore(false);
    }
  }
  
  function toggleModal(item){
    setShowPostModal(!showPostModal)
    setDetail(item)
  }


  if(loading){
    return(
      <div>
        <Header/>

        <div className="content">
          <Title name="Chamados">
            <FiMessageSquare size={25} />
          </Title>

          <div className="container dashboard">
            <span>Buscando chamados...</span>
          </div>
        </div>
      </div>
    )
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Chamados">
          <FiMessageSquare size={25} />
        </Title>

        <>
          {calleds.length === 0 ? (
            <div className="container dashboard">
              <span>Nenhum chamado encontrado...</span>
              <Link to="/new" className="new">
                <FiPlus color="#FFF" size={25} />
                Novo chamado
              </Link>  
            </div>
          ) : (
            <>
              <Link to="/new" className="new">
                <FiPlus color="#FFF" size={25} />
                Novo chamado
              </Link>  

              <table>
                <thead>
                  <tr>
                    <th scope="col">Cliente</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Status</th>
                    <th scope="col">Criado em</th>
                    <th scope="col">#</th>
                  </tr>
                </thead>
                <tbody>
                  {calleds.map((item, index) => {
                    return(
                      <tr key={index}>
                        <td data-label="Cliente">{item.client}</td>
                        <td data-label="Assunto">{item.subject}</td>
                        <td data-label="Status">
                          <span className="badge" style={{ backgroundColor: item.status === 'Aberto' ? ' #999' : item.status === 'Progresso' ? '#f6a935': item.status === 'Atendido'? '#5fd204' : ''}}>
                            {item.status}
                          </span>
                        </td>
                        <td data-label="Cadastrado">{item.createdFormat}</td>
                        <td data-label="#">
                          <button className="action" style={{ backgroundColor: '#3583f6' }} onClick={ () => toggleModal(item)}>
                            <FiSearch color='#FFF' size={17}/>
                          </button>
                          <Link to={`/new/${item.id}`} className="action" style={{ backgroundColor: '#f6a935' }}>
                            <FiEdit2 color='#FFF' size={17}/>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>   


              {loadingMore && <h3>Buscando mais chamados...</h3>}    
              {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore} >Buscar mais</button>  }  
            </>
          )}
        </>

      </div>

      {showPostModal && (
        <Modal
          conteudo={detail}
          close={ () => setShowPostModal(!showPostModal) }
        />
      )}
    
    </div>
  )
}