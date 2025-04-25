import { ISuccursale } from "@/lib/types/succursale";
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
import { ArrowRight, EllipsisVertical, LucideLockOpen, MapPinCheckInsideIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const SuccursaleCard = ({ detail }: { detail: ISuccursale }) => {
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <Link href={`/succursale/${detail.id}`}>
        <div className="text-primary flex flex-row gap-3 items-center">
          <ArrowRight />{detail.nom} <LucideLockOpen color="green" size={13} />
        </div>
        </Link>
        <div>
          <Dropdown>
            <DropdownTrigger className="">
              <Button
                variant="faded"
                size="sm"
                isIconOnly={true}
                startContent={<EllipsisVertical size={12} />}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="edit">Bloquer</DropdownItem>
              <DropdownItem key="new">Modifier</DropdownItem>
              <DropdownItem key="delete" className="text-danger" color="danger">
                Supprimer succursale
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex gap-3 flex-row items-center"><PhoneIcon size={13} />{detail.telephone}</div>
        <div className="flex gap-3 flex-row items-center"><MapPinCheckInsideIcon size={13} />{detail.adresse}</div>
      </CardBody>
    </Card>
  );
};

export default SuccursaleCard;
