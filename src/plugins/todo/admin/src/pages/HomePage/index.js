/*
 *
 * HomePage
 *
 */

import React, { memo } from "react";

import {
  Table,
  Thead, Tbody,
  Tr, Td, Th
} from '@strapi/design-system/Table';

import {
  BaseCheckbox,
  Typography,
  Box,
} from '@strapi/design-system';

const HomePage = () => {
  const ROW_COUNT = 6;
  const COL_COUNT = 10;
  const entry = {
    description: 'Chez Léon is a human sized Parisian',
    category: 'French cuisine',
    contact: 'Leon Lafrite'
  };
  const entries = [];

  for (let i = 0; i < 5; i++) {
    entries.push({
      ...entry,
      id: i
    });
  }

  return (
    <Box padding={8} background="neutral100">
      <Table colCount={COL_COUNT} rowCount={ROW_COUNT}>
        <Thead>
          <Tr>
            <Th>
              <Typography variant="sigma">ID</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Email</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Phone</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Full name</Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {entries.map(entry => <Tr key={entry.id}>
            <Td>
              <Typography textColor="neutral800">{entry.id}</Typography>
            </Td>
            <Td>
              <Typography textColor="neutral800">{entry.description}</Typography>
            </Td>
            <Td>
              <Typography textColor="neutral800">{entry.category}</Typography>
            </Td>
            <Td>
              <Typography textColor="neutral800">{entry.contact}</Typography>
            </Td>
          </Tr>)}
        </Tbody>
      </Table>
    </Box>
  );
};

export default memo(HomePage);