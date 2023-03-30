import Button from '@atlaskit/button';
import axios from 'axios';
import { FC, useContext, useEffect, useState } from 'react';
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
} from 'react-router-dom';
import Team from '../../../assets/team.png';
import { questionsContext } from '../local-contexts';
import { Recordatorios } from '../modals';
import type { Retrospectiva } from '../../../views/mis-retrospectivas/MisRetrospectivas';

const URI = 'http://localhost:8000/retrospectivas';

interface ReponderRetroInfoProps {
  retroPendientes: Retrospectiva[];
}

const ReponderRetroInfo: FC<ReponderRetroInfoProps> = ({
  retroPendientes,
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { questions, setQuestions } = useContext(questionsContext);
  const { retroId } = useParams();

  const getQuestions = async () => {
    const response = await axios
      .get(`${URI}/questions/${retroId}`)
      .then((res) => {
        setQuestions(res.data);
        res.data.length !== 0 && setIsOpen(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (isOpen && questions.length !== 0) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (retroId === '-1') return <Navigate to="/mis-retrospectivas" />;

  return (
    <>
      <div className="flex flex-col py-8  w-full rounded bg-white shadow-sm border-collapse justify-center items-center px-20 gap-10">
        <h2 className="flex font-bold w-full text-[0.9rem] text-textNormal">
          Responder preguntas de retrospectiva
        </h2>
        <div className="flex w-full bg-purple-100 py-10 px-8 h-fit gap-10 items-center justify-center rounded-sm">
          <img src={Team} className="h-36" />
          <div className="flex gap-5 flex-col">
            <h3 className="font-bold w-full text-discovery">
              ¡Hemos concluido con un Sprint, bien hecho!
            </h3>
            <p className="text-sm">
              Es hora de mirar hacia atrás y reflexionar sobre lo que
              logramos en el Sprint. Antes de responder algunas
              preguntas, te recomendamos que{' '}
              <Link to="/metricas" className="text-link underline">
                revises tus métricas
              </Link>{' '}
              para que puedas responder con confianza y precisión.
              ¡Vamos a ello!
            </p>
          </div>
        </div>
        <div className="flex gap-14">
          <Button
            appearance="link"
            onClick={() => navigate('/mis-retrospectivas')}
          >
            Regresar al panel de retrospectivas
          </Button>
          <Button appearance="primary" onClick={() => getQuestions()}>
            Iniciar retrospectiva
          </Button>
        </div>
      </div>
      <div>
        {isOpen && questions.length !== 0 && (
          <Recordatorios
            setIsOpen={setIsOpen}
            retroPendientes={retroPendientes}
          />
        )}
      </div>
    </>
  );
};

export default ReponderRetroInfo;
