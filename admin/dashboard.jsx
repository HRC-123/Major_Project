// src/components/Dashboard.jsx
import React from "react";
import { Box, H2, Text } from "@adminjs/design-system";

const Dashboard = (props) => {

    console.log(props)
  const stats = props || {};

  return (
    <Box variant="grey">
      <H2>📊 CSE Board Portal Admin Dashboard</H2>
      <Text mt="lg">Supabase-powered portal overview:</Text>

      <Box mt="xl">
        <Text>
          <strong>👥 Users:</strong> {stats.users}
        </Text>
        <Text>
          <strong>📄 Documents:</strong> {stats.documents}
        </Text>
        <Text>
          <strong>📘 Subjects:</strong> {stats.subjects}
        </Text>
        <Text>
          <strong>🏛️ Departments:</strong> {stats.departments}
        </Text>

        <Box mt="md">
          <Text>
            <strong>📚 Department Names:</strong>
          </Text>
          {stats.departmentNames?.map((name, i) => (
            <Text key={i}>• {name}</Text>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
