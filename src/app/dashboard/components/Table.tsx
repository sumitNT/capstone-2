import { IconButton, Table } from "@hdfclife-insurance/one-x-ui";
import {
  ArrowDown,
  ArrowDownIcon,
  ArrowsDownUp,
  GearSix,
} from "@phosphor-icons/react";
import { ArrowUp } from "@phosphor-icons/react/dist/ssr";
import React, { useState } from "react";
import { useTableContext } from "../../../context/tableContext";
import Link from "next/link";
import data from "./table-data.json"


export default function CustomTable() {

  const {sortConfig, handleSortToggle} = useTableContext();
  const tableData = data.tableData
  console.log(data)
  
  return (
    <>
      <Table fixedLayout withTableBorder highlightOnHover>
        <Table.Head>
          <Table.Row className="">
            <Table.Th className="bg-gray-300">
              <div className="flex items-center gap-[8px]  !font-bold">
                Date
                <IconButton
                  color="gray"
                  size="xs"
                  variant="tertiary"
                  onClick={() => handleSortToggle("date")}
                >
                  {sortConfig.date === "ascending" ? (
                    <ArrowUp />
                  ) : sortConfig.date === "descending" ? (
                    <ArrowDown />
                  ) : (
                    <ArrowsDownUp />
                  )}
                </IconButton>
              </div>
            </Table.Th>
            <Table.Th className="bg-gray-300 ">
              <div className="flex items-center gap-[8px]  !font-bold">
                Loader Id
                <IconButton 
                  color="gray" 
                  size="xs" 
                  variant="tertiary"
                  onClick={() => handleSortToggle("loaderId")}
                >
                  {sortConfig.loaderId === "ascending" ? (
                    <ArrowUp />
                  ) : sortConfig.loaderId === "descending" ? (
                    <ArrowDown />
                  ) : (
                    <ArrowsDownUp />
                  )}
                </IconButton>
              </div>
            </Table.Th>
            <Table.Th className="bg-gray-300 ">
              <div className="flex items-center gap-[8px]  !font-bold">
                Template Name
                <IconButton 
                  color="gray" 
                  size="xs" 
                  variant="tertiary"
                  onClick={() => handleSortToggle("templateName")}
                >
                  {sortConfig.templateName === "ascending" ? (
                    <ArrowUp />
                  ) : sortConfig.templateName === "descending" ? (
                    <ArrowDown />
                  ) : (
                    <ArrowsDownUp />
                  )}
                </IconButton>
              </div>
            </Table.Th>
            <Table.Th className="bg-gray-300">
              <div className="flex items-center gap-[8px]  !font-bold">
                Loader Type
                <IconButton 
                  color="gray" 
                  size="xs" 
                  variant="tertiary"
                  onClick={() => handleSortToggle("loaderType")}
                >
                  {sortConfig.loaderType === "ascending" ? (
                    <ArrowUp />
                  ) : sortConfig.loaderType === "descending" ? (
                    <ArrowDown />
                  ) : (
                    <ArrowsDownUp />
                  )}
                </IconButton>
              </div>
            </Table.Th>
            <Table.Th className="bg-gray-300">
              <div className="flex items-center gap-[8px]  !font-bold">
                Uploaded By
                <IconButton 
                  color="gray" 
                  size="xs" 
                  variant="tertiary"
                  onClick={() => handleSortToggle("uploadedBy")}
                >
                  {sortConfig.uploadedBy === "ascending" ? (
                    <ArrowUp />
                  ) : sortConfig.uploadedBy === "descending" ? (
                    <ArrowDown />
                  ) : (
                    <ArrowsDownUp />
                  )}
                </IconButton>
              </div>
            </Table.Th>
            <Table.Th className="bg-gray-300 ">
              <div className="flex items-center gap-[8px]  !font-bold">
                Action
              </div>
            </Table.Th>
          </Table.Row>
        </Table.Head>
        <Table.Body> 
          {tableData.map((row, index) => (
            <Table.Row key={row.id || index}>
              <Table.Cell>{row.date}</Table.Cell>
              <Table.Cell>{row.loaderId}</Table.Cell>
              <Table.Cell>{row.templateName}</Table.Cell>
              <Table.Cell>{row.loaderType}</Table.Cell>
              <Table.Cell>{row.uploadedBy}</Table.Cell>
              <Table.Cell>{row.action}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}
