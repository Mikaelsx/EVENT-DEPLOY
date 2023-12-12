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