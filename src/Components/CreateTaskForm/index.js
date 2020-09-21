import React from "react";
import { Formik } from "formik";
import { makeStyles } from "@material-ui/core/styles";

import moment from "moment";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import * as Yup from "yup";

import TagForm from "./TagForm";

const useStyles = makeStyles(() => ({
  root: { padding: "25px 50px 25px 50px" },

  content: { margin: "10px 20px 10px 20px" },
}));

export default function CreateTaskForm({ modal, props, toggleModal }) {
  const classes = useStyles();

  return (
    <Formik
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .min(2, "Too Short!")
          .max(20, "Too Long!")
          .required("Name Required"),
      })}
      validateOnChange
      initialValues={
        modal.value
          ? {
              name: modal.value.name,
              tag: "",
              tags: modal.value.tags,
            }
          : { name: "", tag: "", tags: [] }
      }
      onSubmit={(values, actions) => {
        delete values["tag"];
        if (modal.value) {
          const updatedTask = { ...modal.value, ...values };
          props.updateTask(updatedTask);
        } else {
          values.date = moment().format("LL");
          console.log("Submitting", values, actions);
          props.createTask(values);
        }
        actions.setSubmitting(false);
        actions.resetForm();
        toggleModal({ show: false, value: null });
      }}
    >
      {(formik) => {
        const handleDeleteTag = (i) => {
          const filterTags = formik.values.tags;
          filterTags.splice(i, 1);
          formik.setFieldValue("tags", filterTags);
        };
        console.log(formik.errors);
        return (
          <form onSubmit={formik.handleSubmit}>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              style={classes.root}
            >
              <Typography variant={"h6"}>Create a new Task!</Typography>
              <TextField
                label="Task Name"
                variant="outlined"
                type="text"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                style={classes.content}
                error={formik.errors.name}
                helperText={formik.errors.name}
              />
              <TagForm formik={formik} style={classes.content} />
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                style={classes.content}
              >
                {formik.values.tags.map((v, i) => {
                  return (
                    <Chip
                      label={v}
                      onDelete={() => {
                        handleDeleteTag(i);
                      }}
                    />
                  );
                })}
              </Grid>
              <Button
                variant="contained"
                color="primary"
                style={classes.content}
              >
                Submit
              </Button>
            </Grid>
          </form>
        );
      }}
    </Formik>
  );
}
