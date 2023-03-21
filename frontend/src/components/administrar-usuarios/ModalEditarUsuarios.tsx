import React, { FC } from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';

import './css/ModalEditarUsuarios.css';
import DropdowRoles from './DropdownRoles';
import DropdownEtiquetas from './DropdownEtiquetas';

import CrossIcon from '@atlaskit/icon/glyph/cross';
import SectionMessage from '@atlaskit/section-message';

const URI = 'http://localhost:8000/usuarios/info/';

interface ModalEditarUsuariosProps {
  show: boolean;
  onClose: () => void;
  info: any;
}

const ModalEditarUsuarios: FC<ModalEditarUsuariosProps> = ({
  show,
  onClose,
  info,
}) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [roles, setRol] = useState<string[]>([]);
  const [etiquetas, setEtiquetas] = useState<string[]>([]);

  const handleRolSeleccionado = (rol: string) => {
    setRol(roles);
  };

  const handleClose = () => {
    onClose();
  };

  const getUsuario = async () => {
    try {
      const res = await axios.get(`${URI}${info}`);
      const usuario = res.data.usuario.shift();
      setNombre(usuario.nombre);
      setCorreo(usuario.correo);
      setRol(usuario.roles);
      setEtiquetas(usuario.etiquetas);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsuario();
  }, []);

  //FALTAN: handleSubmit, traer datos del usuario a editar

  if (!show) {
    return null;
  } else {
    return (
      <>
        <div className="modal z-[1000000000]">
          <div className="modal-content px-10 py-[18rem]">
            <div className="modal-header">
              <div className="modal-title">
                <h4>Modificar Usuario</h4>
                <button onClick={handleClose}>
                  <CrossIcon label="Cross Icon" />
                </button>
              </div>
              <div className="modal-subtitle">
                Modifica los datos de un usuario en el sistema.
              </div>
            </div>
            <div className="modal-body">
              <p className="font-bold text-left mb-4">
                Detalles de usuario
              </p>
              <SectionMessage appearance="information">
                <p className="text-[#0055CC] text-xs ">
                  Algunos detalles están deshabilitados debido a que
                  la cuenta del usuario está conectada a una cuenta de
                  Google.
                </p>
              </SectionMessage>
              <form
                action=""
                className="flex flex-col mt-4"
                id="EditarUsuarioForm"
              >
                <div className="flex gap-4 mb-5">
                  <div className="w-full flex flex-col">
                    <label
                      htmlFor="nombre"
                      className="text-xs text-[#626f86] font-semibold"
                    >
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      className="h-8 border-2 border-gray-300 rounded-sm p-2 focus:outline-gray-400 hover:bg-gray-100"
                      defaultValue={nombre}
                    />
                  </div>
                </div>
                <div className="flex flex-col mb-5">
                  <label
                    htmlFor="correo"
                    className=" text-xs full text-[#626f86] font-semibold"
                  >
                    Correo
                  </label>
                  <input
                    type="text"
                    placeholder={correo}
                    disabled={true}
                    className="h-8 border-2 border-gray-300 rounded-sm p-2 disabled:bg-[#F1F2F4]"
                  ></input>
                </div>
                <div className="flex flex-col mb-5">
                  <label
                    htmlFor="rol"
                    className=" text-xs full text-[#626f86] font-semibold"
                  >
                    Rol
                  </label>
                  <DropdowRoles
                    onRolSeleccionadoChange={handleRolSeleccionado}
                    rolActual={'chef'}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="etiquetas"
                    className="text-xs full text-[#626f86] font-semibold"
                  >
                    Etiquetas
                  </label>
                  <DropdownEtiquetas
                    etiquetasPreseleccionadas={[
                      {
                        id: 1,
                        etiqueta: 'Front-End',
                        color: 'blueLight',
                      },
                    ]}
                    onEtiquetasSeleccionadasChange={setEtiquetas}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <div className="flex gap-10 mt-8">
                <button
                  className="rounded-none hover:text-blue-500 text-sm"
                  onClick={handleClose}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="EditarUsuarioForm"
                  className="rounded-sm bg-jiraBlue text-white px-2 py-1 hover:bg-blue-500"
                >
                  <p className="text-sm">Registrar Usuario</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default ModalEditarUsuarios;
