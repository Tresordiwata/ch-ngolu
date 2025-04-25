/* eslint-disable prettier/prettier */
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Divider,
} from "@heroui/react";
import React, { useEffect,forwardRef, useImperativeHandle } from "react";


export default function ModalUsable(
  {hideFooter=false,isOpened,titre,children,okText,cancelText,isHideBtnCancel,onOk}:
  {hideFooter?:boolean,isOpened:boolean,titre:React.ReactNode,children?:React.JSX.Element,onOk:()=>void,okText?:string,cancelText?:string,isHideBtnCancel?:boolean}
) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  useEffect(()=>{
    
    isOpened?onOpenChange():onOpenChange()
    
  },[!isOpened])
  
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isKeyboardDismissDisabled={true} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {titre}
                <Divider />
              </ModalHeader>
              <ModalBody>
               {children}
              </ModalBody>
              {
                !hideFooter &&
              <ModalFooter>
                {!isHideBtnCancel &&
                <Button color="danger" size="sm" variant="light" onPress={onClose}>
                  {cancelText || "Annuler"}
                </Button>}
                <Button color="primary" size="sm" onPress={onOk || onClose}>
                  {okText || "Ok"}
                </Button>
              </ModalFooter>
              }
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
