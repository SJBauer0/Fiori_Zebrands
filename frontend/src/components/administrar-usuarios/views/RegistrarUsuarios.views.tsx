// import React, { FC, useCallback, useState } from 'react'
// import Modal, {
//     ModalBody,
//     ModalFooter,
//     ModalHeader,
//     ModalTitle,
//     ModalTransition,
//   } from '@atlaskit/modal-dialog';
//   import Button from '@atlaskit/button';



// const RegistrarUsuarios = ({  }) => {
//     const [isOpen, setisOpen] = useState(false)
//     const openModal = useCallback(() => setisOpen(true), [])
//     const closeModal = useCallback(() => setisOpen(false), [])

//     return (
//         <div>
//         <Button onClick={openModal}>Open Modal</Button>
//         <ModalTransition>
//             {isOpen && (
//                 <Modal onClose={closeModal}>
//                     <ModalHeader>
//                         <ModalTitle>Registar Usuario</ModalTitle>
//                     </ModalHeader>
//                     <ModalBody>
//                         <p>Modal body</p>
//                     </ModalBody>
//                     <ModalFooter>
//                         <button onClick={closeModal}>Close</button>
//                         <button onClick={closeModal}>Save</button>
//                     </ModalFooter>
//                 </Modal>    
//             )}
//         </ModalTransition>
//         </div>
// )}

import React, { useCallback, useRef, useState } from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import Button from '@atlaskit/button/standard-button';
import { Field } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTransition,
} from '@atlaskit/modal-dialog';

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const focusRef = useRef<HTMLElement>();

  return (
    <>
      <Button appearance="primary" onClick={openModal}>
        Open modal
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal autoFocus={focusRef} onClose={closeModal}>
            <ModalHeader>
              <Breadcrumbs>
                <BreadcrumbsItem href="#" text="Projects" />
                <BreadcrumbsItem href="#" text="Design System Team" />
              </Breadcrumbs>
            </ModalHeader>
            <ModalBody>
              <Field label="Email" name="my-email" defaultValue="">
                {({ fieldProps }) => (
                  <Textfield
                    ref={focusRef}
                    autoComplete="off"
                    placeholder="ian@atlas.com"
                    {...fieldProps}
                  />
                )}
              </Field>
            </ModalBody>
            <ModalFooter>
              <Button appearance="subtle">Learn more</Button>
              <Button appearance="primary" onClick={closeModal} autoFocus>
                Sign up
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </>
  );
}