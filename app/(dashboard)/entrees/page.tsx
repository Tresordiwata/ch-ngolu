import React from 'react'
import RecetteClient from './RecetteClient'
import { cookies } from 'next/headers';
import { IUtilisateur } from '@/lib/types/utilisateur';

const page = async() => {
   const Cookies = await cookies();
  
    const profil = JSON.parse(`${Cookies.get("profil")?.value}`) as IUtilisateur;
  return (
    <RecetteClient profil={profil} />
  )
}

export default page