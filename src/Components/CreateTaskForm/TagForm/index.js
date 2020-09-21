import React from "react";
import { Formik } from "formik";
import TextField from "@material-ui/core/TextField";

const TagForm = ({ formik, ...rest }) => {
  return (
    <Formik initialValues={{ tag: "", tags: [] }}>
      {() => {
        const _handleKeyDown = (e) => {
          if (e.key === "Enter") {
            if (formik.values.tag.length > 1) {
              formik.setFieldValue("tags", [
                ...formik.values.tags,
                formik.values.tag,
              ]);
              formik.setFieldValue("tag", "");
            }
          }
        };

        const onTagChange = (e) => {
          const value = e.target.value;
          if (
            value.charAt(value.length - 1) == "," ||
            value.charAt(value.length - 1) == " "
          ) {
            const newTag = value.slice(0, value.length - 1);
            if (newTag.length > 1) {
              formik.setFieldValue("tags", [...formik.values.tags, newTag]);
              formik.setFieldValue("tag", "");
            }
          } else {
            formik.handleChange(e);
          }
        };
        return (
          <TextField
            label="Task Tags"
            variant="outlined"
            type="text"
            name="tag"
            onChange={onTagChange}
            value={formik.values.tag}
            onKeyDown={_handleKeyDown}
            {...rest}
          />
        );
      }}
    </Formik>
  );
};

export default TagForm;
