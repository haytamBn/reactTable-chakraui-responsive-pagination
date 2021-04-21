import React from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  VStack,
  Grid,
  theme,
  Heading,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Logo } from "./Logo";

import TablePerso from "./components/table";

export const App = () => {
  const data = React.useMemo(
    () => [
      {
        id: "1233",
        fromUnit: "inches",
        toUnit: "millimetres (mm)",
        factor: 25.4,
      },
      {
        id: "1",
        fromUnit: "feet",
        toUnit: "centimetres (cm)",
        factor: 30.48,
      },
      {
        id: "13",
        fromUnit: "yards",
        toUnit: "metres (m)",
        factor: 0.91444,
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "To convert",
        accessor: "fromUnit",
      },
      {
        Header: "Into",
        accessor: "id",
        Cell: ({ value }) => <Flex>Perso Render</Flex>,
      },
      {
        Header: "Multiply by",
        accessor: "factor",
        isNumeric: true,
      },
    ],
    []
  );

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>
            <Logo h="20vmin" pointerEvents="none" />
          </VStack>

          <Heading>
            React Table + ChaKra UI + Responsive Table + Numbring Pagination{" "}
          </Heading>

          <Flex p="20px">
            <TablePerso
              data={data}
              columns={columns}
              isResponsive={true}
              onRowClick={(row: any) => console.log(row)}
              responsiveView={<Flex>responsive here....</Flex>}
              isPaginate
              onPageChanged={(f: any) => alert(JSON.stringify(f))}
              currentPage={1}
              totalRecords={300}
              pageLimit={10}
            />
          </Flex>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
