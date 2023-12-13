import React, { useContext, useEffect, useState } from "react";
import MainContent from "../../components/MainContent/MainContent";
import Title from "../../components/Title/Title";
import TableE from "./TableDTE/TableDTE";
import Container from "../../components/Container/Container";
import { Select } from "../../components/FormComponents/FormComponents";
import Spinner from "../../components/Spinner/Spinner";
import Modal from "../../components/Modal/Modal";
import api, {
  eventsResource,
  myEventsResource,
  presencesEventResource,
  commentaryEventResource,
} from "../../Services/Service";

import "./DetalhesEvento.css";
import { UserContext } from "../../context/AuthContext";


const DetalhesEvento = () => {
  // state do menu mobile
  const [exibeNavbar, setExibeNavbar] = useState(false);
  const [eventos, setEventos] = useState([]);
  // select mocado
  const [quaisEventos, setQuaisEventos] = useState([
    { value: "1", text: "Todos os eventos" },
    { value: 2, text: "Meus eventos" },
  ]);

  const [tipoEvento, setTipoEvento] = useState("1"); //código do tipo do Evento escolhido
  const [showSpinner, setShowSpinner] = useState(false);
  const [showModal, setShowModal] = useState(false);


  // recupera os dados globais do usuário
  const { userData, setUserData } = useContext(UserContext);

  useEffect(() => {
    setShowSpinner(true);

    loadEventsType();
  }, [tipoEvento, userData.userId]);

  async function loadEventsType() {
    try {
      if (tipoEvento === "1") {
        const promise = await api.get("/Evento");
        const promiseEventos = await api.get(
          `/PresencasEvento/ListarMinhas/${userData.userId}`
        );

        const dadosMarcados = verificaPresenca(
          promise.data,
          promiseEventos.data
        );
        console.clear();
        console.log("DADOS MARCADOS");
        console.log(dadosMarcados);

        // console.log("DADOS MARCADOS");
        // console.log(dadosMarcados);

        // console.log(typeEA.data);
        setEventos(promise.data);
      } else {
        let arrEventos = [];
        const promiseEventos = await api.get(
          `/PresencasEvento/ListarMinhas/${userData.userId}`
        );

        promiseEventos.data.forEach((element) => {
          arrEventos.push({
            ...element.evento,
            situacao: element.situacao,
            idPresencaEvento: element.idPresencaEvento,
          });
        });
        setEventos(arrEventos);
      }
    } catch (error) {
      console.log("Erro ao listar eventos");
      console.log(error);
    }
    setShowSpinner(false);
  }

  const verificaPresenca = (arrAllEvents, eventsUser) => {
    for (let x = 0; x < arrAllEvents.length; x++) {
      for (let i = 0; i < eventsUser.length; i++) {
        if (arrAllEvents[x].idEvento === eventsUser[i].idEvento) {
          arrAllEvents[x].situacao = true;
          arrAllEvents[x].idPresencaEvento = eventsUser[i].idPresencaEvento;
          break;
        }
      }
    }
    return arrAllEvents;
  };

  // toggle meus eventos ou todos os eventos
  async function myEvents(tpEvent) {
    setTipoEvento(tpEvent);
  }

  async function loadMyComentary(idComentary) {
    console.log("Carregar o comentario");
  }

  const showHideModal = async () => {
    setShowModal(showModal ? false : true);
  };

  const postMyComentary = async (e) => {
    e.preventDefault();

    try {
      const postComment = await api.post("/eventos-aluno", {
        descricao : describe, // Errado
        idUsuario : userData,
        idEvento : eventos,
        // exibe : 
      })
      console.log("Comentário cadastrado");
      console.log(postComment.data);
      setQuaisEventos("")
      // setExibeNavbar("")
      // setUserData("")
      // setEventos("")

      const listPostComment = await api.get("/Eventos-aluno");
      console.log(listPostComment.data);
      setEventos(listPostComment.data)

    } catch (error) {
      console.log("Comentario nao cadastrado.");
      console.log(error);
    }
  };

  // async function postMyComentary(e) {
  //   e.preventDefault();

  //   try {
  //     const postComment = await api.post("/eventos-aluno", {
  //       descricao : describe,
  //       idUsuario : userData,
  //       idEvento : eventos,
  //       exibe : Modal
  //     })
  //     console.log("Comentário cadastrado");
  //     console.log(postComment.data);
  //     setQuaisEventos("")
  //     // setExibeNavbar("")
  //     // setUserData("")
  //     // setEventos("")

  //     const listPostComment = await api.get("/Eventos-aluno");
  //     console.log(listPostComment.data);
  //     setEventos(listPostComment.data)

  //   } catch (error) {
  //     console.log("Comentario nao cadastrado.");
  //     console.log(error);
  //   }
  // };

  const commentaryRemove = async (id) => {
    console.log("Remover o comentário");
    try {
      api.delete(`/eventos-aluno/${id}`)// Errado
      console.log("Comentario removido");
    } catch (error) {
      console.log("Erro ao remover comentario");
      console.log(Error)
    }

      // const delete = await api.get(`/evento-aluno`);
      // console.log(delete.data);
      // setEventos(delete.data)
  };

  async function handleConnect(
    idEvent,
    whatTheFunction,
    idPresencaEvento = null
  ) {
    if (whatTheFunction === "connect") {
      try {
        const promise = await api.post("/PresencasEvento", {
          situacao: true,
          idUsuario: userData.userId,
          idEvento: idEvent,
        });

        if (promise.status === 201) {
          loadEventsType();
          alert("Presenca confirmada, parabens");
        }
      } catch (error) {
        console.log("Erro ao conectar");
        console.log(Error);
      }
      return;
    }
    console.log("Presenca do evento");
    console.log(idPresencaEvento);

    const promiseDelete = await api.delete("/PresencasEvento/" + idPresencaEvento);
    if (promiseDelete.status === 204) {
      loadEventsType();
      alert("Desconectar do evento" + idEvent);
    }
  }
  return (
    <>
      <MainContent>
        <Container>
          <Title titleText={"Eventos"} className="custom-title" />

          <Select
            id="id-tipo-evento"
            name="tipo-evento"
            required={true}
            dados={quaisEventos} // aqui o array dos tipos
            manipulationFunction={(e) => myEvents(e.target.value)} // aqui só a variável state
            defaultValue={tipoEvento}
            additionalclass="select-tp-evento"
          />
          <Table
            dados={eventos}
            fnConnect={handleConnect}
            fnShowModal={() => {
              showHideModal();
            }}
          />
        </Container>
      </MainContent>

      {/* SPINNER -Feito com position */}
      {showSpinner ? <Spinner /> : null}

      {showModal ? (
        <Modal
        userId={userData.userId}
        showHideModal={showHideModal}
        fnGet={loadMyComentary}
        fnPost={postMyComentary}
        fnDelete={commentaryRemove}
          // userId={userData.userId}
          // showHideModal={showHideModal}
          // fnDelete={commentaryRemove}
        />
      ) : null}
    </>
  );
};


export default DetalhesEvento;