"use client";
import { Button } from "@heroui/button";
import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

import PageContent from "@/layouts/PageContent";
import { getSuccursales } from "@/services/succursale";
import { ISuccursale } from "@/lib/types/succursale";
import { EyeIcon } from "@/styles/icones";

const PageClient = () => {
  const [spinning, setSpinning] = useState(false);
  const succursales = useQuery({
    queryKey: ["succursales"],
    queryFn: getSuccursales,
  }).data as ISuccursale[];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    setSpinning(true)
    fetch("/api/reporting/finance/", {
      method: "POST",
      body: JSON.stringify(f),
    })
      .then((r) => r.json())
      .then((r) => {})
      .catch()
      .finally(() => {
        setSpinning(false);
      });
    // console.log(f);
  };

  return (
    <PageContent titre={"Reports financiers"}>
      <div className="flex flex-col gap-4 px-5">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardBody>
              <div className="grid grid-cols-3">
                <Select
                  isRequired
                  label="Succursale"
                  labelPlacement="outside"
                  name="succursale"
                >
                  {succursales?.map((succursale, i) => (
                    <SelectItem key={succursale.id}>
                      {succursale?.nom}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="grid grid-cols-4 mt-4 gap-4 items-center">
                <Input
                  key={"dateFrom"}
                  isRequired
                  fullWidth={true}
                  label="Du"
                  labelPlacement="outside"
                  name="dateFrom"
                  type="date"
                />
                <Input
                  key={"dateTo"}
                  isRequired
                  label="Au"
                  labelPlacement="outside"
                  name="dateEnd"
                  type="date"
                />

                <Select
                  isRequired
                  label="Devise"
                  labelPlacement="outside"
                  name="devise"
                >
                  <SelectItem key={"USD"}>USD</SelectItem>
                  <SelectItem key={"CDF"}>CDF</SelectItem>
                </Select>
                <Button
                  color="primary"
                  startContent={<EyeIcon />}
                  type="submit"
                >
                  Visualiser
                </Button>
              </div>
            </CardBody>
          </Card>
        </form>
        <Card>
          <CardHeader className="border-b border-gray-700">Resultat</CardHeader>
          <CardBody>
            {spinning ? (
              <Spinner size="lg" variant="wave" />
            ) : (
              <Table border={2} color="primary">
                <TableHeader>
                  <TableColumn className="bg-primary-100">Rubrique</TableColumn>
                  <TableColumn className="bg-primary-100">
                    21/02/2027
                  </TableColumn>
                  <TableColumn className="bg-primary-100">TOTAL</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-b border-gray-700">
                    <TableCell className="">45454</TableCell>
                    <TableCell>45454</TableCell>
                    <TableCell>10</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>
      </div>
    </PageContent>
  );
};

export default PageClient;
