"use client";
import { Button } from "@heroui/button";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Spinner,
  Tab,
  Tabs,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

import PageContent from "@/layouts/PageContent";
import { getSuccursales } from "@/services/succursale";
import { ISuccursale } from "@/lib/types/succursale";
import { EyeIcon } from "@/styles/icones";
import { useServiceStore } from "@/store/store";
import { IDepense } from "@/lib/types/depense";
import { IRecette } from "@/lib/types/recette";

const PageClient = () => {
  const [spinning, setSpinning] = useState(false);
  const [allDates, setAllDates] = useState<any[]>([]);
  const [allDepenses, setAllDepenses] = useState<IDepense[]>([]);
  const [allRecettes, setAllRecettes] = useState<IRecette[]>([]);
  const [devise, setDevise] = useState("");
  // const [rubriques,setRubriques]=useState<IRubrique | null>(null);
  const { rubriques } = useServiceStore();

  const succursales = useQuery({
    queryKey: ["succursales"],
    queryFn: getSuccursales,
  }).data as ISuccursale[];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));

    setSpinning(true);
    fetch("/api/reporting/finance/", {
      method: "POST",
      body: JSON.stringify(f),
    })
      .then((r) => r.json())
      .then((r) => {
        setAllDates(r?.alldates);
        setAllDepenses(r?.depenses);
        setAllRecettes(r?.recettes);
      })
      .catch()
      .finally(() => {
        setSpinning(false);
      });
    // console.log(f);
  };

  useEffect(() => {}, []);

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
                  onChange={(e) => {
                    setDevise(e.target.value);
                  }}
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
          <CardHeader className="border-b-0 border-gray-700">
            Resultat
          </CardHeader>
          <CardBody>
            {spinning ? (
              <Spinner size="lg" variant="wave" />
            ) : (
              <Tabs className="w-full">
                <Tab key="depense" className="w-full" title="Dépenses">
                  <table
                    border={2}
                    color="primary border border-gray-100 w-full"
                  >
                    <thead>
                      <tr className="bg-primary-100">
                        <th className="bg-primary-100 py-3 px-2">Rubrique</th>
                        <>
                          {allDates?.map((dt, i) => (
                            <th
                              key={i}
                              className="bg-primary-100 text-center border-l border-gray-700 px-2"
                            >
                              {moment(dt).format("DD/MM/YYYY")}
                            </th>
                          ))}
                          <th className="border-l border-gray-700 text-center px-2">
                            Total
                          </th>
                          {/* <TableColumn className="bg-primary-100">
                        21/02/2027
                      </TableColumn>
                      <TableColumn className="bg-primary-100">TOTAL</TableColumn> */}
                        </>
                      </tr>
                    </thead>
                    <tbody>
                      {rubriques
                        ?.filter((r) => {
                          return r.typeRubr == "D";
                        })
                        .map((rubrique, index) => (
                          <tr key={index} className="border-b border-gray-700">
                            <td className="py-2">{rubrique.libelle}</td>
                            <>
                              {allDates?.map((dt, i) => (
                                <td
                                  key={i}
                                  className="text-center border-l border-gray-700"
                                >
                                  {(allDepenses?.length > 0 &&
                                    allDepenses
                                      .filter((dep) => {
                                        return (
                                          moment(dep.dateDepense).format(
                                            "YYYY-MM-DD",
                                          ) == dt &&
                                          dep.rubriqueId == rubrique.id
                                        );
                                      })
                                      .reduce(
                                        (prev, acc) => prev + acc.montant,
                                        0,
                                      )) ||
                                    0}{" "}
                                  {devise}
                                </td>
                              ))}
                              <td className="border-l border-gray-700 text-center bg-yellow-100 dark:bg-indigo-500">
                                {(allDepenses?.length > 0 &&
                                  allDepenses
                                    .filter((dep) => {
                                      return dep.rubriqueId == rubrique.id;
                                    })
                                    .reduce(
                                      (prev, acc) => prev + acc.montant,
                                      0,
                                    )) ||
                                  0}{" "}
                                {devise}
                              </td>
                            </>
                            {/* <TableCell>45454</TableCell>
                            <TableCell>10</TableCell> */}
                          </tr>
                        ))}
                      <tr className="font-bold bg-primary-100">
                        <td className="">Total</td>
                        {allDates.map((dt, i) => (
                          <td key={i} className="text-center">
                            {allDepenses
                              .filter((dep) => {
                                return (
                                  moment(dep.dateDepense).format(
                                    "YYYY-MM-DD",
                                  ) == dt
                                );
                              })
                              .reduce((prev, acc) => prev + acc.montant, 0) ||
                              0}{" "}
                            {devise}
                          </td>
                        ))}
                        <td className="text-center">
                          {allDepenses.reduce(
                            (prev, acc) => prev + acc.montant,
                            0,
                          )}{" "}
                          {devise}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Tab>
                <Tab key="recette" title="Recette">
                  <table border={2} color="primary border border-gray-100">
                    <thead>
                      <tr className="bg-primary-100">
                        <th className="bg-primary-100 py-3 px-2">Rubrique</th>
                        <>
                          {allDates?.map((dt, i) => (
                            <th
                              key={i}
                              className="px-2 bg-primary-100 text-center border-l border-gray-700"
                            >
                              {moment(dt).format("DD/MM/YYYY")}
                            </th>
                          ))}
                          <th className="border-l border-gray-700 text-center">
                            Total
                          </th>
                          {/* <TableColumn className="bg-primary-100">
                        21/02/2027
                      </TableColumn>
                      <TableColumn className="bg-primary-100">TOTAL</TableColumn> */}
                        </>
                      </tr>
                    </thead>
                    <tbody>
                      {rubriques
                        ?.filter((r) => {
                          return r.typeRubr == "R";
                        })
                        .map((rubrique, index) => (
                          <tr key={index} className="border-b border-gray-700">
                            <td className="py-2 px-2">{rubrique.libelle}</td>
                            <>
                              {allDates?.map((dt, i) => (
                                <td
                                  key={i}
                                  className="px-2 text-center border-l border-gray-700"
                                >
                                  {(allRecettes?.length > 0 &&
                                    allRecettes
                                      .filter((dep) => {
                                        return (
                                          moment(dep.dateRecette).format(
                                            "YYYY-MM-DD",
                                          ) == dt &&
                                          dep.rubriqueId == rubrique.id
                                        );
                                      })
                                      .reduce(
                                        (prev, acc) => prev + acc.montant,
                                        0,
                                      )) ||
                                    0}{" "}
                                  {devise}
                                </td>
                              ))}
                              <td className="px-2 border-l border-gray-700 text-center bg-yellow-100 dark:bg-indigo-500">
                                {(allRecettes?.length > 0 &&
                                  allRecettes
                                    .filter((rec) => {
                                      return rec.rubriqueId == rubrique.id;
                                    })
                                    .reduce(
                                      (prev, acc) => prev + acc.montant,
                                      0,
                                    )) ||
                                  0}{" "}
                                {devise}
                              </td>
                            </>
                            {/* <TableCell>45454</TableCell>
                            <TableCell>10</TableCell> */}
                          </tr>
                        ))}
                      <tr className="font-bold bg-primary-100">
                        <td className="">Total</td>
                        {allDates.map((dt, i) => (
                          <td key={i} className="text-center px-2">
                            {allRecettes
                              .filter((rec) => {
                                return (
                                  moment(rec.dateRecette).format(
                                    "YYYY-MM-DD",
                                  ) == dt
                                );
                              })
                              .reduce((prev, acc) => prev + acc.montant, 0) ||
                              0}{" "}
                            {devise}
                          </td>
                        ))}
                        <td className="text-center px-2">
                          {allRecettes.reduce(
                            (prev, acc) => prev + acc.montant,
                            0,
                          )}{" "}
                          {devise}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Tab>
              </Tabs>
            )}
          </CardBody>
        </Card>
      </div>
    </PageContent>
  );
};

export default PageClient;
