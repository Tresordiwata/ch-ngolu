import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'

const ModalAntReusable = (
    {titre,btnOkText="Ok",btnCancelText="Annuler",children=<></>,isOpened=null,onOk}:
    {titre:React.ReactNode,btnOkText?:string,btnCancelText?:string,children:React.ReactNode,isOpened:null | Date, onOk:()=>void}
) => {
    const [modalOpened,setModalOpened]=useState(false)

    useEffect(()=>{
        isOpened!==null && setModalOpened(true)
        
    //    setIsModalOpened(isOpened)
    //    isOpened?setIsModalOpened(isOpened):setIsModalOpened(isOpened)
      },[isOpened])
  return (
    <Modal cancelText={btnCancelText} okText={btnOkText} title={titre} open={modalOpened} onOk={()=>{onOk();setModalOpened(false)}} onCancel={()=>{setModalOpened(false);}}>
        {children}
    </Modal>

  )
}

export default ModalAntReusable