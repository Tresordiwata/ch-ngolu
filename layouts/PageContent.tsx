"use client";
import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";

const PageContent = ({
  titre = "",
  children,
}: {
  titre?: String | React.JSX.Element;
  children: React.JSX.Element;
}) => {
  return (
    <Card>
      <CardHeader className="text-primary-50 border-b border-gray-700">
        <h1 className="text-primary text-lg font-bold">{titre}</h1>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
};

export default PageContent;
