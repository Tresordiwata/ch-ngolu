"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: '100%',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 30,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
  },
  amount: {
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
  },
});

interface ExportData {
  title: string;
  headers: string[];
  rows: (string | number)[][];
  summary?: {
    label: string;
    value: string;
  }[];
}

interface PDFExportProps {
  isOpen: boolean;
  onClose: () => void;
  data: ExportData;
}

export function PDFExport({ isOpen, onClose, data }: PDFExportProps) {
  const formatDate = () => {
    return new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-bold">Aperçu du PDF</h2>
        </ModalHeader>
        <ModalBody>
          <div className="h-[80vh]">
            <PDFViewer style={{ width: '100%', height: '100%' }}>
              <Document>
                <Page size="A4" style={styles.page}>
                  <Text style={styles.header}>{data.title}</Text>
                  <Text style={styles.subHeader}>Date: {formatDate()}</Text>

                  <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                      {data.headers.map((header, index) => (
                        <Text 
                          key={index} 
                          style={[
                            styles.tableCell,
                            typeof data.rows[0]?.[index] === 'number' && styles.amount
                          ]}
                        >
                          {header}
                        </Text>
                      ))}
                    </View>

                    {data.rows.map((row, rowIndex) => (
                      <View key={rowIndex} style={styles.tableRow}>
                        {row.map((cell, cellIndex) => (
                          <Text 
                            key={cellIndex} 
                            style={[
                              styles.tableCell,
                              typeof cell === 'number' && styles.amount
                            ]}
                          >
                            {typeof cell === 'number' 
                              ? new Intl.NumberFormat('fr-FR', {
                                  style: 'currency',
                                  currency: 'XOF',
                                }).format(cell)
                              : cell}
                          </Text>
                        ))}
                      </View>
                    ))}
                  </View>

                  {data.summary && (
                    <View style={{ marginTop: 20 }}>
                      {data.summary.map((item, index) => (
                        <View key={index} style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                          <Text style={styles.tableCell}>{item.label}</Text>
                          <Text style={[styles.tableCell, styles.amount]}>{item.value}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <Text style={styles.footer}>
                    Gestion Finance - Document généré le {formatDate()}
                  </Text>
                </Page>
              </Document>
            </PDFViewer>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}