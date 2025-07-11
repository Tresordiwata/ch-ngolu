"use client";
import { IRecette } from "@/lib/types/recette";
import {
  Document,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import moment, { lang } from "moment";
import n2words from "n2words";
import React from "react";

// import { BACKEND_URL } from "@/lib/utils";
// import { IFactureImport } from "@/lib/types/factureImport";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: "5 5",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 0,
    flexDirection: "row",
    borderBottom: "0px solid #2563eb",
    paddingBottom: 0,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  companyName: {
    fontSize: 18,
    color: "#2563eb",
    fontWeight: "bold",
    marginBottom: 5,
  },
  companyInfo: {
    marginBottom: 30,
    backgroundColor: "",
    padding: 15,
    borderRadius: 5,
  },
  companyText: {
    fontSize: 9,
    color: "#475569",
    marginBottom: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#1e293b",
    textAlign: "right",
  },
  invoiceInfo: {
    fontSize: 10,
    color: "#64748b",
    textAlign: "right",
  },
  table: {
    display: "table",
    width: "100%",
    marginBottom: 30,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    borderBottomStyle: "solid",
    alignItems: "center",
    height: 32,
    fontSize: 9,
  },
  tableHeader: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
  },
  tableCell: {
    width: "25%",
    padding: 8,
    color: "#1e293b",
  },
  tableCellHeader: {
    width: "25%",
    padding: 8,
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
  text: {
    fontSize: 9,
    color: "#475569",
  },
  bold: {
    fontWeight: "bold",
    color: "#1e293b",
  },
  totals: {
    marginTop: 20,
    alignItems: "flex-end",
    borderTop: "2px solid #e2e8f0",
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 5,
  },
  totalLabel: {
    width: 100,
    textAlign: "right",
    paddingRight: 10,
    fontSize: 10,
    color: "#64748b",
  },
  totalValue: {
    width: 100,
    textAlign: "right",
    fontSize: 10,
    color: "#1e293b",
  },
  grandTotal: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2563eb",
  },
});
const colorBlue = "#072BAF";
const rubriques = [
  {
    client: "SOMIKA SAS",
    typeFacture: "C",
    rubriques: [
      {
        description: "SEGUCE",
        qt: "1,00",
        pu: "125,00",
        taxe: "Exoneré de TVA",
        mt: "$ 125,00",
      },
      {
        description: "SCELLE ELECTRONIQUE",
        qt: "1,00",
        pu: "40,00",
        taxe: "Exoneré de TVA",
        mt: "$ 40,00",
      },
      {
        description: "KANYAKA",
        qt: "1,00",
        pu: "30,00",
        taxe: "Exoneré de TVA",
        mt: "$ 30,00",
      },
      {
        description: "FRAIS CONNEXES",
        qt: "1,00",
        pu: "347,00",
        taxe: "Exoneré de TVA",
        mt: "$ 347,00",
      },
      {
        description: "LIQUIDATION",
        qt: "1,00",
        pu: "0,00",
        taxe: "16%",
        mt: "$ 0,00",
      },
      {
        description: "HONORAIRES",
        qt: "1,00",
        pu: "50,00",
        taxe: "16%",
        mt: "$ 50,00",
      },
    ],
    sousTotal: "$ 592,00",
    sousTotal1: "$ 0,00",
    sousTotal2: "$ 8,00",
    total: "$ 600.00",
    totalNumber: 600,
  },
];
const style1 = { fontSize: 11 };
const entete = {
  display: "flex",
  flexDirection: "column",
  alignItem: "center",
};
const Recu = ({ recette }: { recette?: IRecette }) => {


  return (
    <PDFViewer width={"100%"}>
      <Document title="facture">
        <Page size={"A5"} style={{ fontFamily: "Helvetica" }}>
          <View
            style={{ paddingHorizontal: 7, paddingVertical: 12, fontSize: 10 }}
          >
            <View
              style={{
                display: "flex",
                borderBottom: "1px solid #ccc",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Image src={`/logo-ngolu.png`} style={{ width: 35 }} />
              <View
                style={{
                  display: "flex",
                  gap: 4,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text style={style1}>REPUBLIQUE DEMOCRATIQUE DU CONGO</Text>
                </View>
                <View>
                  <Text style={style1}>ARMEE DU SALUT / SERVICE MEDICAL</Text>
                </View>
                <View>
                  <Text style={style1}>{recette?.succursale?.nom}</Text>
                </View>
              </View>
              <Text> </Text>
            </View>
            <View
              style={{ paddingTop: 12, paddingRight: 20, textAlign: "right" }}
            >
              <Text>Date : {moment().format("DD/MM/YYYY")}</Text>
            </View>
            <View
              style={{
                paddingTop: 15,
                paddingRight: 20,
                textAlign: "center",
                textDecoration: "underline",
                fontSize: 15,
              }}
            >
              <Text>Motif</Text>
            </View>
            <View
              style={{
                paddingTop: 7,
                paddingRight: 20,
                textAlign: "center",
                fontSize: 13,
              }}
            >
              <Text>{recette?.rubrique?.libelle}</Text>
            </View>
            <View
              style={{
                paddingTop: 13,
                marginTop: 12,
                paddingRight: 20,
                textAlign: "left",
                fontSize: 12,
              }}
            >
              <Text>Montant : {recette?.montant} {recette?.devise}</Text>
            </View>
            <View
              style={{
                paddingTop: 14,
                paddingRight: 20,
                textAlign: "left",
                fontSize: 12,
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center"
              }}
            >
              <Text style={{textDecoration:"underline"}}>Montant en lettre : </Text>
              <Text style={{textAlign:"center", marginTop:11}}>{n2words(recette?.montant, { lang: "fr" })} {recette?.devise=="USD"?"Dollars":"Francs congolais"}</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default Recu;
