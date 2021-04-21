import React from "react";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Flex,
  useMediaQuery,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

import { useTable, useSortBy } from "react-table";
import PaginationPerso, { PageProps } from "./Pagination";

interface TablePersoProps {
  data: any;
  columns: any;
  isResponsive?: boolean;
  onRowClick?: (row: any) => void;
  responsiveView?: React.ReactElement<{ data: Array<any> }>;
  isPaginate?: boolean;
  currentPage?: number;
  totalRecords?: number;
  pageLimit?: number;
  onPageChanged?: (f: PageProps) => void;
}

const TablePerso: React.FC<TablePersoProps> = ({
  data,
  columns,
  isResponsive,
  responsiveView,
  onRowClick,
  isPaginate,
  currentPage,
  totalRecords,
  pageLimit,
  onPageChanged,
}: TablePersoProps): React.ReactElement => {
  const [isLargerThan1120] = useMediaQuery("(min-width: 1120px)");
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  return (
    <>
      {isResponsive && !isLargerThan1120 ? (
        <Flex
          display="flex"
          direction="column"
          align={["center", "center", "unset", "unset"]}
          width="100%"
        >
          {responsiveView}
        </Flex>
      ) : (
        <Flex flexDirection="column" w="100%">
          <Table variant="unstyled" {...getTableProps()}>
            <Thead bg="gray.200">
              {headerGroups.map((headerGroup) => (
                <Tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, index) => (
                    <Th
                      fontWeight="bold"
                      fontSize="sm"
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      isNumeric={column.isNumeric}
                    >
                      {column.render("Header")}
                      <chakra.span pl="4">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <TriangleDownIcon aria-label="sorted descending" />
                          ) : (
                            <TriangleUpIcon aria-label="sorted ascending" />
                          )
                        ) : null}
                      </chakra.span>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <Tr
                    onClick={(): void => onRowClick(row)}
                    _active={{ bg: "green.25", borderRadius: "10px" }}
                    {...row.getRowProps()}
                  >
                    {row.cells.map((cell) => (
                      <Td
                        fontSize="sm"
                        {...cell.getCellProps()}
                        isNumeric={cell.column.isNumeric}
                      >
                        {cell.render("Cell")}
                      </Td>
                    ))}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>

          {isPaginate && (
            <PaginationPerso
              alignSelf="flex-end"
              currentPage={currentPage}
              totalRecords={totalRecords}
              pageLimit={pageLimit}
              onPageChanged={onPageChanged}
            />
          )}
        </Flex>
      )}
    </>
  );
};

export default TablePerso;
