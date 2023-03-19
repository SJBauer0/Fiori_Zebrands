import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './css/ModalRegistrarUsuarios.css';

import CrossIcon from '@atlaskit/icon/glyph/cross';
import DropdowRoles from './DropdownRoles';

interface RegistrarUsuariosProps {
  show: boolean;
  onClose: () => void;
}

const ModalRegistrarUsuarios: FC<RegistrarUsuariosProps> = ({
  show,
  onClose,
}) => {
  const [correo, setCorreo] = useState('');
  const [rol, setRol] = useState('');

  const handleRolSeleccionado = (rol: string) => {
    setRol(rol);
  };

  const store = async (e: any) => {
    e.preventDefault();
    window.alert(`Correo: ${correo} Rol: ${rol}`);
    setCorreo('');
    setRol('');
    onClose();
  };

  if (!show) {
    return null;
  }
  return (
    <>
      <div className="modal">
        <div className="modal-content px-10">
          <div className="modal-header">
            <div className="modal-title">
              <h4>Registrar usuario</h4>
              <button className="flex" onClick={onClose}>
                <CrossIcon label="Cross Icon" />
              </button>
            </div>
            <div className="modal-subtitle">
              Registra un nuevo usuario en el sistema, una invitación
              a iniciar sesión será enviada al correo ingresado.
            </div>
          </div>
          <div className="modal-body">
            <p className="font-bold text-left mb-4">
              Detalles del nuevo usuario
            </p>
            <form
              onSubmit={store}
              className="w-full"
              id="RegistrarUsuarioForm"
            >
              <div className="flex flex-col">
                <label htmlFor="correo" id="label-correo">
                  Correo
                </label>
                <div className="flex w-full gap-4">
                  <input
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    type="text"
                    name="correo"
                    id="input-correo"
                    className="border-2 border-gray-300 rounded-sm p-2 focus:outline-gray-400 hover:bg-gray-100"
                    autoComplete="off"
                    placeholder="Ingresa el correo"
                  />
                  <input
                    type="text"
                    name="terminacion-correo"
                    id="input-dominio-correo"
                    className="border-2 border-gray-300 rounded-sm p-2 disabled:bg-gray-200"
                    disabled
                    placeholder="@zeb.mx"
                  />
                </div>
                <p className="text-[0.75rem] text-gray-600 mt-1 mb-4">
                  El correo debe de pertenecer a una cuenta de Google
                  zeb.mx. Ingresa solo la parte izquierda (antes del
                  @) del correo a registrar.
                </p>
              </div>
              <div className="flex flex-col">
                <label htmlFor="rol" id="label-rol">
                  Rol
                </label>
                <DropdowRoles
                  onRolSeleccionadoChange={handleRolSeleccionado}
                />
              </div>
              <div className="flex flex-col mt-4 mb-2">
                <label htmlFor="etiquetas" id="label-etiquetas">
                  Etiquetas
                </label>
                <div className=" flex gap-12">
                  <div className="grid grid-cols-2 items-start w-full">
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                    <div>4</div>
                  </div>
                  <div className="w-full">
                    <select
                      required
                      name="etiquetas"
                      id="dropdown-etiquetas"
                      className="w-44 h-8 bg-slate-100 rounded-md pl-2 hover:bg-gray-200 text-sm font-medium"
                    >
                      <option disabled selected>
                        Añadir Etiqueta
                      </option>
                      <option value="">Full-Stack</option>
                      <option value="">Front-End</option>
                      <option value="">Back-End</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <div className="flex gap-10 mt-12">
              <button
                className="rounded-none hover:text-blue-500 text-sm"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="RegistrarUsuarioForm"
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
};

export default ModalRegistrarUsuarios;