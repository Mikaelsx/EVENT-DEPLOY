import React, { useEffect, useState } from "react";
import "./HomePage.css";

import Banner from "../../components/Banner/Banner";
import MainContent from "../../components/MainContent/MainContent";
import VisionSection from "../../components/VisionSection/VisionSection";
import ContactSection from "../../components/ContactSection/ContactSection";
import Title from "../../components/Title/Title";
import NextEvent from "../../components/NextEvent/NextEvent";
import BeforeEvent from "../../components/BeforeEvent/BeforeEvent"
import Container from "../../components/Container/Container";
import api from "../../Services/Service";
import Notification from "../../components/Notification/Notification";
import { nextEventResource } from "../../Services/Service";
import { beforeEventResource } from "../../Services/Service";


const HomePage = () => {
  const [nextEvents, setNextEvents] = useState([]);
  const [beforeEvents, setBeforeEvents] = useState([]);
  const [notifyUser, setNotifyUser] = useState(); //Componente Notification

  // roda somente na inicialização do componente
  useEffect(() => {
    async function getNextEvents() {
      try {
        const promise = await api.get(nextEventResource);
        const dados = await promise.data;

        // console.log(dados);
        setNextEvents(dados); //atualiza o state

      } catch (error) {
        console.log("não trouxe os próximos eventos, verifique lá!");
        // setNotifyUser({
        //   titleNote: "Erro",
        //   textNote: `Não foi possível carregar os próximos eventos. Verifique a sua conexão com a internet`,
        //   imgIcon: "danger",
        //   imgAlt:
        //   "Imagem de ilustração de erro. Rapaz segurando um balão com símbolo x.",
        //   showMessage: true,
        // });
      }
    }

    
    getNextEvents(); //chama a função
//----------------------------------------------------------
    async function getBeforeEvents() {
      try {
        const promiseB = await api.get(nextEventResource);
        const dadosB = await promiseB.data;

        setBeforeEvents(dadosB)
      } catch (error) {
        console.log("não trouxe os todos os eventos , verifique lá!");
      }
    }
    getBeforeEvents();
  }, []);

  // useEffect(() => {
  //   async function getBeforeEvents() {
  //     try {
  //       const promiseB = await api.get(nextEventResource);
  //       const dadosB = await promiseB.data;

  //       setBeforeEvents(dadosB)
  //     } catch (error) {
  //       console.log("não trouxe os todos os eventos , verifique lá!");
  //     }
  //   }
  //   getBeforeEvents();
  // }, [])

  return (
    
    <MainContent>
      {<Notification {...notifyUser} setNotifyUser={setNotifyUser} />}
      <Banner />

      {/* PRÓXIMOS EVENTOS */}
      <section className="proximos-eventos">
        <Container>
          <Title titleText={"Próximos Eventos"} />

          <div className="eventos-box">
            {nextEvents.map((e) => {
              return (
                <NextEvent
                  key={e.idEvento}
                  title={e.nomeEvento}
                  description={e.descricao}
                  eventDate={e.dataEvento}
                  idEvent={e.idEvento}
                />
              );
            })}
          </div>
        </Container>
      </section>

      {/* EVENTOS ANTERIORES*/}
      <section className="eventos-anteriores">
        <Container>
          <Title titleText={"Eventos Anteriores"} />

          <div className="eventos-box">
            {beforeEvents.map((e) => {
              return (
                <BeforeEvent
                  key={e.idEvento}
                  title={e.nomeEvento}
                  description={e.descricao}
                  eventDate={e.dataEvento}
                  idEvent={e.idEvento}
                />
              );
            })}
          </div>
        </Container>
      </section>

      <VisionSection />
      <ContactSection />
    </MainContent>
  );
};

export default HomePage;
