import React from "react";
import "./BeforeEvent.css";
import { Link, NavLink } from "react-router-dom";

import { Tooltip } from "react-tooltip";

// importar a função lá do arquivo stringFunction (destructuring)
import { dateFormatDbToView } from "../../Utils/stringFunctions";

const BeforeEvent = ({ title, description, eventDate, idEvent }) => {
  function conectar(idEvent) {
    // dá pra usar a prop idEvent? testar
    alert(`Chamar o recurso para conectar: ${idEvent}`);
  }
  return (
    <article className="event-card">
      <h2 className="event-card__title">{title}</h2>

      <p
        className="event-card__description"
        
        data-tooltip-id={idEvent}
        data-tooltip-content={description}
        data-tooltip-place="top"
      >
        <Tooltip id={idEvent} className="tooltip" />
        {description.substr(0, 15)} ...
      </p>

      <p className="event-card__description">
        {/* aplicar a função pra converter a data */}
        {dateFormatDbToView(eventDate)}
      </p>

      <NavLink
        className="event-card__connect-link"
        to={"/detalhes-evento"}
        // onClick={() => {
        //   to="/detalhes-evento"
        // }}
      >
        Acessar
      </NavLink>
    </article>
  );
};

export default BeforeEvent;
