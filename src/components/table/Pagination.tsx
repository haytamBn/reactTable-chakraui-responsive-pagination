import React, { useState, useCallback } from "react";
import { Flex, Box, Select, FlexProps } from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { ReactComponent as JumpRight } from "../../assets/icons/jump-next.svg";
import { ReactComponent as JumpLeft } from "../../assets/icons/jump-prev.svg";

const PREV = "LEFT";
const JUMP_PREV = "JUMP_PREV";
const NEXT = "RIGHT";
const JUMP_NEXT = "JUMP_NEXT";

const range = (from: number, to: number, step: number = 1): Array<number> => {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
};

interface PaginationPersoProps extends FlexProps {
  pageLimit: number;
  totalRecords: number;
  currentPage: number;
  onPageChanged: (f: PageProps) => void;
}

export interface PageProps {
  currentPage: number;
  totalPages?: number;
  pageLimit: number;
  totalRecords?: number;
}
const PaginationPerso = (props: PaginationPersoProps): React.ReactElement => {
  const [pageLimit, setPageLimit] = useState<number>(props.pageLimit);
  const totalRecords: number = props.totalRecords;

  const pageNeighbours: number = 3;

  const totalPages: number = Math.ceil(totalRecords / pageLimit);

  const [currentPage, setCurrentPage] = useState<number>(props.currentPage);

  const gotoPage = useCallback(
    (page: number, limit?: number): void => {
      const { onPageChanged = (f: PageProps): PageProps => f } = props;

      const currentPage = Math.max(0, Math.min(page, totalPages));

      const paginationData = {
        currentPage,
        totalPages: totalPages,
        pageLimit: limit || pageLimit,
        totalRecords: totalRecords,
      };
      setCurrentPage(currentPage);
      onPageChanged(paginationData);
    },
    [pageLimit, props, totalPages, totalRecords]
  );

  const handleClick = (page: number): void => {
    gotoPage(page);
  };

  const handlePageLimit = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
    const target = evt.target as HTMLSelectElement;
    setPageLimit(parseInt(target.value));
    gotoPage(1, parseInt(target.value));
  };

  const handleMoveLeft = (): void => {
    gotoPage(currentPage - 1);
  };
  const handleJumpLeft = (): void => {
    gotoPage(1);
  };

  const handleMoveRight = (): void => {
    gotoPage(currentPage + 1);
  };

  const handleJumpRight = (): void => {
    gotoPage(totalPages);
  };

  const fetchPageNumbers = (): (string | number)[] => {
    const totalP = totalPages;
    const currentP = currentPage;
    const pNeighbours = pageNeighbours;

    const totalNumbers = pNeighbours + 2;
    const totalBlocks = totalNumbers + 2;

    if (totalP > totalBlocks) {
      let pages: Array<string | number> = [];

      const leftBound = currentP - (pNeighbours - 1);
      const rightBound = currentP + (pNeighbours - 1);

      const startPage = leftBound > 1 ? leftBound : 1;
      const endPage = rightBound < totalP ? rightBound : totalP;

      pages = range(startPage, endPage);

      const pagesCount = pages.length;
      const singleSpillOffset = totalNumbers - pagesCount - 1;

      const leftSpill = startPage > 1;
      const rightSpill = endPage < totalP;

      const leftSpillPage = PREV;
      const rightSpillPage = NEXT;

      if (leftSpill && !rightSpill) {
        const extraPages = range(startPage - singleSpillOffset, startPage - 1);
        pages = [leftSpillPage, ...extraPages, ...pages];
      } else if (!leftSpill && rightSpill) {
        const extraPages = range(endPage + 1, endPage + singleSpillOffset);
        pages = [...pages, ...extraPages, rightSpillPage];
      } else if (leftSpill && rightSpill) {
        pages = [leftSpillPage, ...pages, rightSpillPage];
      }
      return [JUMP_PREV, ...pages, JUMP_NEXT];
    }

    return range(1, totalP);
  };

  if (!totalRecords) return null;

  return (
    <>
      <Flex {...props} mt="30px" direction={["column", "column", "row", "row"]}>
        {totalPages > 1 && (
          <Flex
            flex={1}
            justify={["center", "center", "flex-start", "flex-start"]}
          >
            <Flex align="center">
              {fetchPageNumbers().map((page, index) => {
                if (page === JUMP_PREV) {
                  return (
                    <Flex
                      mr="32px"
                      cursor="pointer"
                      key={index}
                      onClick={handleJumpLeft}
                    >
                      <JumpLeft />
                    </Flex>
                  );
                }
                if (page === PREV) {
                  return (
                    <Flex
                      mr="24px"
                      key={index}
                      onClick={handleMoveLeft}
                      cursor="pointer"
                    >
                      <ChevronLeftIcon color="gray.100" />
                    </Flex>
                  );
                }
                if (page === NEXT) {
                  return (
                    <Flex
                      ml="24px"
                      key={index}
                      onClick={handleMoveRight}
                      cursor="pointer"
                    >
                      <ChevronRightIcon color="gray.100" />
                    </Flex>
                  );
                }
                if (page === JUMP_NEXT) {
                  return (
                    <Flex
                      ml="32px"
                      cursor="pointer"
                      key={index}
                      onClick={handleJumpRight}
                    >
                      <JumpRight />
                    </Flex>
                  );
                }
                return currentPage === page ? (
                  <Box
                    key={index}
                    as="button"
                    w="35px"
                    h="35px"
                    border="none"
                    _expanded={{
                      borderColor: "green.100",
                      bg: "teal.100",
                    }}
                    fontWeight="500"
                    color="white"
                    bg="teal.100"
                    fontSize="sm"
                    borderRadius="5px"
                    onClick={(): void => handleClick(Number(page))}
                  >
                    {page}
                  </Box>
                ) : (
                  <Box
                    key={index}
                    as="button"
                    w="35px"
                    h="35px"
                    fontWeight="bold"
                    fontSize="sm"
                    onClick={(): void => handleClick(Number(page))}
                  >
                    {page}
                  </Box>
                );
              })}
            </Flex>
          </Flex>
        )}
        <Flex
          flex={1}
          align="center"
          direction="row"
          justify={["center", "center", "flex-end", "flex-end"]}
          marginTop={["12px", "12px", "0", "0"]}
        >
          <Select
            className="page_limit"
            w="120px"
            h="35px"
            size="sm"
            boxShadow="0.36px 0.93px 29px #00000012"
            color="#6C6C6C"
            onChange={handlePageLimit}
            defaultValue="10"
          >
            <option value="10">10/page</option>
            <option value="20">20/page</option>
            <option value="30">30/page</option>
          </Select>
        </Flex>
      </Flex>
    </>
  );
};

export default PaginationPerso;
