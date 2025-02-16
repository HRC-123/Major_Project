import React from "react";
import { Box, TextField, Button } from "@adminjs/design-system";
import { useRecord } from "adminjs";

const AddSubject = () => {
  const { record } = useRecord();

  const handleSubmit = (event) => {
    event.preventDefault();
    const newSubject = event.target.subject.value;

    // Perform the action to add a new subject (handle it through an API or similar)
    console.log(`New Subject: ${newSubject}`);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <TextField name="subject" label="Subject Name" />
        <Button type="submit">Add Subject</Button>
      </form>
    </Box>
  );
};

export default AddSubject;
