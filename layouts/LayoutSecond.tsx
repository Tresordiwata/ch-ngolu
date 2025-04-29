"use client";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Grip } from "lucide-react";
import React from "react";

const LayoutSecond = ({
  titre = "",
  children,
}: {
  titre?: String | React.JSX.Element;
  children: React.JSX.Element;
}) => {
  return (
    <div className="flex flex-col gap-10">
      <Card>
        <CardBody className="text-primary-50 border-gray-700">
          <h1 className="text-primary text-lg font-bold flex flex-gap items-center gap-4"><Grip />{titre}</h1>
        </CardBody>
      </Card>
      <Card className="mt-8">
        <CardBody>{children}</CardBody>
      </Card>
    </div>
  );
};

export default LayoutSecond;
