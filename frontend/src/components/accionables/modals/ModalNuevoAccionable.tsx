import Blanket from '@atlaskit/blanket';
import Button, { LoadingButton } from '@atlaskit/button';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import EditorErrorIcon from '@atlaskit/icon/glyph/editor/error';
import TextArea from '@atlaskit/textarea';
import { HelperMessage, ErrorMessage } from '@atlaskit/form';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FC, useContext, useState } from 'react';
import { FlagContext, userDataContext } from '../../../contexts';

const URI = `${import.meta.env.VITE_APP_BACKEND_URI}/accionables`;

interface ModalNuevoAccionable {
  getAccionables: () => void;
  setIsModalOpen: (value: boolean) => void;
}

interface Accionable {
  accionable: string;
  fecha: string;
}

const labelStyle =
  "after:content-['*'] after:text-[#ae2a19] text-xs font-semibold text-label";
const MAX_CARACTERES = 70;
const TODAY = new Date().toISOString().substr(0, 10);

const ModalNuevoAccionable: FC<ModalNuevoAccionable> = ({
  getAccionables,
  setIsModalOpen,
}) => {
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const { user } = useContext(userDataContext);
  const { addFlag } = useContext(FlagContext);
  const [accionable, setAccionable] = useState<Accionable>({
    accionable: '',
    fecha: '',
  });
  const [validPattern, setValidPattern] = useState<boolean>(true);
  const [showMaxDescriptionWarning, setShowMaxDescriptionWarning] =
    useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const handleChangeAccionable = (e: any) => {
    verificarInput(e.target.value);
    setAccionable({ ...accionable, accionable: e.target.value });
  };

  const handleChangeFecha = (e: any) => {
    setAccionable({ ...accionable, fecha: e.target.value });
  };
  const verificarInput = (texto: string) => {
    const alfanumerico = /^[a-zA-Z0-9ñÑ\s]*$/;
    if (texto.length === 0) {
      setShowMaxDescriptionWarning(false);
      setValidPattern(true);
      return;
    }
    if (!alfanumerico.test(texto)) {
      setIsError(true);
      setValidPattern(false);
      return;
    }
    if (texto.length > MAX_CARACTERES) {
      setIsError(true);
      setShowMaxDescriptionWarning(true);
      return;
    }

    if (
      texto.length <= MAX_CARACTERES &&
      alfanumerico.test(texto) &&
      texto.length > 0
    ) {
      setIsError(false);
      setShowMaxDescriptionWarning(false);
      setValidPattern(true);
      return;
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isError) {
      return;
    } else {
      setIsPosting(true);
      let key_jira;
      try {
        const body = {
          id_usuario: user?.id_usuario,
          descripcion: accionable.accionable,
        };
        const responseJira = await axios.post(
          `${URI}/post/${body.id_usuario}/${body.descripcion}`
        );
        key_jira = responseJira.data.key;
        const bodyDB = {
          id_usuario: user?.id_usuario,
          descripcion: accionable.accionable,
          fecha_estimada: accionable.fecha,
          key_jira: key_jira,
        };
        await axios.post(URI, bodyDB);

        getAccionables();
        setIsModalOpen(false);
        addFlag(
          'Accionable agregado correctamente al Backlog de Jira',
          CheckCircleIcon,
          'success'
        );
      } catch (error) {
        if (error instanceof Error) {
          addFlag(
            'Hubo un problema al agregar el accionable. Por favor, intenta nuevamente.',
            EditorErrorIcon,
            'error',
            error.toString()
          );
        } else {
          addFlag(
            'Hubo un problema al agregar el accionable. Por favor, intenta nuevamente.',
            EditorErrorIcon,
            'error',
            'Error desconocido'
          );
        }
      } finally {
        setIsPosting(false);
      }
    }
  };

  return (
    <Blanket isTinted={true}>
      <motion.div
        animate={{ opacity: 1 }}
        className="flex flex-col w-full h-full items-center justify-center opacity-0"
      >
        <div className="flex flex-col bg-white rounded p-10 gap-8 items-center justify-center drop-shadow-lg min-w-[40vw] max-w-[55vw]">
          <div className="flex w-full justify-between items-center">
            <h2 className="text-textNormal font-semibold text-base">
              Registrar nuevo accionable
            </h2>
            <div
              className="flex items-center justify-center cursor-pointer p-1"
              onClick={() => setIsModalOpen(false)}
            >
              <CrossIcon label="cerrar modal" size="small" />
            </div>
          </div>
          <div className="w-full flex flex-col gap-6 h-fit max-h-[55vh] overflow-y-auto pb-2">
            <div className="flex flex-col gap-2">
              <p className={labelStyle}>Accionable</p>
              <p className="text-xs text-[#626F86]">
                Ingresa una breve descripción de tu accionable.
                Recuerda que este accionable también se mostrará en el
                Backlog de Jira.
              </p>
              <form onSubmit={handleSubmit} id="formAccionable">
                <TextArea
                  maxHeight="1rem"
                  name="accionable"
                  value={accionable.accionable}
                  onChange={handleChangeAccionable}
                  className={`text-sm w-full border-2  rounded-sm p-2 hover:bg-gray-100 placeholder:text-xs h-10 ${
                    showMaxDescriptionWarning || !validPattern
                      ? 'focus:!border-red-500 !border-red-500'
                      : 'focus:!border-blue-500'
                  }`}
                  autoComplete="off"
                  placeholder="Ingresa tu nuevo accionable"
                  isRequired
                />
                <div className="w-full flex flex-col justify-end items-end">
                  <HelperMessage>
                    Caracteres: {accionable.accionable.length} /{' '}
                    {MAX_CARACTERES}
                  </HelperMessage>
                  {showMaxDescriptionWarning && (
                    <ErrorMessage>
                      Tu respuesta excede el número de caracteres
                      permitidos
                    </ErrorMessage>
                  )}
                  {!validPattern && (
                    <ErrorMessage>
                      Solo se permiten caracteres alfanuméricos en
                      este campo
                    </ErrorMessage>
                  )}
                </div>
                <div className="flex flex-col gap-2 mt-6">
                  <p className={labelStyle}>
                    Fecha límite de cumplimiento
                  </p>
                  <p className="text-xs text-[#626F86]">
                    Selecciona una fecha realista y alcanzable para
                    completar tu nuevo accionable.
                  </p>
                  <input
                    required
                    min={TODAY}
                    type="date"
                    className="w-1/2 bg-slate-50 border mt-1 rounded-sm p-2 text-xs text-gray-500 focus:outline-blue-500 hover:bg-gray-100 placeholder:text-xs h-8"
                    onChange={handleChangeFecha}
                  />
                </div>
                <div
                  className="flex items-center justify-end
            w-full gap-5 mt-9"
                >
                  <Button
                    appearance="subtle"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <LoadingButton
                    type="submit"
                    appearance="primary"
                    isLoading={isPosting}
                  >
                    Registrar accionable
                  </LoadingButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </Blanket>
  );
};

export default ModalNuevoAccionable;
