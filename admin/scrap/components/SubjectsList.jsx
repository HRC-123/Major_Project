import React from "react";
import { Box, Select, Text } from "@adminjs/design-system";
import { useRecord } from "adminjs";

const SubjectsList = () => {
  const { record } = useRecord();
  const years = record?.params?.years || [];

  // Render dropdowns dynamically based on year, branch, and semester
  return (
    <Box>
      <Text>Year: {record?.params?.year}</Text>
      <Text>Branch: {record?.params?.branch}</Text>
      <Text>Semester: {record?.params?.semester}</Text>
      <Select
        options={years.map((year) => ({
          value: year.year,
          label: `Year ${year.year}`,
        }))}
      />
    </Box>
  );
};

export default SubjectsList;
