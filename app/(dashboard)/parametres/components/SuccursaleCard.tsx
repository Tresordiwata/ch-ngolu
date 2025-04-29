import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import {
  ArrowRight,
  EllipsisVertical,
  LucideLockOpen,
  MapPinCheckInsideIcon,
  PhoneIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { IUtilisateur } from "@/lib/types/utilisateur";
import { ISuccursale } from "@/lib/types/succursale";

const SuccursaleCard = ({
  detail,
  profil,
}: {
  profil?: IUtilisateur;
  detail: ISuccursale;
}) => {
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <Link href={`/succursale/${detail.id}`}>
          <div className="text-primary flex flex-row gap-3 items-center">
            <ArrowRight />
            {detail.nom} <LucideLockOpen color="green" size={13} />
          </div>
        </Link>
        {profil?.role === "ADMIN_GENERAL" && (
          <div>
            <Dropdown>
              <DropdownTrigger className="">
                <Button
                  isIconOnly={true}
                  size="sm"
                  startContent={<EllipsisVertical size={12} />}
                  variant="faded"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="edit">Bloquer</DropdownItem>
                <DropdownItem key="new">Modifier</DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                >
                  Supprimer succursale
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )}
      </CardHeader>
      <CardBody>
        <div className="flex gap-3 flex-row items-center">
          <PhoneIcon size={13} />
          {detail.telephone}
        </div>
        <div className="flex gap-3 flex-row items-center">
          <MapPinCheckInsideIcon size={13} />
          {detail.adresse}
        </div>
      </CardBody>
    </Card>
  );
};

export default SuccursaleCard;
