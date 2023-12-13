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
import { useParams } from "react-router-dom";

const {IdEvento} = useParams();

const DetalhesEvento = () => {
  const [eventos, setEventos] = useState([]);

  const [tipoEvento, setTipoEvento] = useState("1"); //código do tipo do Evento escolhido
  const [showSpinner, setShowSpinner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { userData } = useContext(UserContext);
  const [comentario, setComentario] = useState("");
  const [idEvento, setIdEvento] = useState("");
  const [idComentario, setIdComentario] = useState(null);

useEffect(() => {
  loadComentsType();
}, [comentario, userData.userId])

async function loadComentsType() {
  setShowSpinner(true);

  if (comentario === "1") {
    //todos os eventos (Evento)
    try {
      const todosComentarios = await api.get(commentaryEventResource);

      const eventosMarcados = verificaPresenca(
        todosComentarios.data,
      );

      setEventos(eventosMarcados);


    } catch (error) {

      console.log("Erro na API");
      console.log(error);
    }
  } else if (tipoEvento === "2") {
    /**
     * Lista os meus eventos (PresencasEventos)
     * retorna um formato diferente de array
     */
    try {
      const retornoEventos = await api.get(
        `${myEventsResource}/${userData.userId}`
      );
      // console.clear();
      // console.log("MINHAS PRESENÇAS");
      // console.log(retornoEventos.data);

      const arrEventos = []; //array vazio

      retornoEventos.data.forEach((e) => {
        arrEventos.push({
          ...e.evento,
          situacao: e.situacao,
          idPresencaEvento: e.idPresencaEvento,
        });
      });

      // console.log(arrEventos);
      setEventos(arrEventos);
    } catch (error) {
      //colocar o notification
      console.log("Erro na API");
      console.log(error);
    }
  } else {
    setEventos([]);
  }
  setShowSpinner(false);
}
const verificaPresenca = (arrAllEvents, eventsUser) => {
  for (let x = 0; x < arrAllEvents.length; x++) {
    //para cada evento principal
    for (let i = 0; i < eventsUser.length; i++) {
      //procurar a correspondência em minhas presenças
      if (arrAllEvents[x].idEvento === eventsUser[i].evento.idEvento) {
        arrAllEvents[x].situacao = true;
        arrAllEvents[x].idPresencaEvento = eventsUser[i].idPresencaEvento;
        break; //paro de procurar para o evento principal atual
    }
  }
}

  
  return (
    <>
      <MainContent>
        <Container>
          <Title titleText={"Comentários"} additionalClass="custom-title" />

          <Select
            id="id-tipo-evento"
            name="tipo-evento"
            required={true}
            options={quaisEventos} // aqui o array dos tipos
            manipulationFunction={(e) => myEvents(e.target.value)} // aqui só a variável state
            defaultValue={tipoEvento}
            additionalClass="select-tp-evento"
          />
          <TableE
            dados={eventos}
            fnConnect={handleConnect}
            fnShowModal={showHideModal}
          />
        </Container>
      </MainContent>
      {/* SPINNER -Feito com position */}
      {showSpinner ? <Spinner /> : null}

      {showModal ? (
        <Modal
          // userId={userData.userId}
          showHideModal={showHideModal}
          fnGet={loadMyCommentary}
          fnPost={postMyCommentary}
          fnDelete={commentaryRemove}
          comentaryText={comentario}
          userId={userData.userId}
          idEvento={idEvento}
          idComentario={idComentario}
        />
      ) : null}
    </>
  );
};
}

export default DetalhesEvento;