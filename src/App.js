import React, { useState } from "react";
import { useCountdown } from "./hooks";
import moment from "moment";
import { connect } from "react-redux";
import * as actions from "./store/actions/index";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import SearchBar from "./Components/SearchBar/index";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Chip from "@material-ui/core/Chip";

import CreateTaskForm from "./Components/CreateTaskForm";

import { KeyboardDatePicker } from "@material-ui/pickers";

const humanize = (seconds) => {
  var sec_num = parseInt(seconds, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return hours + "hrs " + minutes + "mins " + seconds + "secs";
};
const TotalTime = ({ startTime, times }) => {
  const active = times.length > 0 && times[times.length - 1].e === undefined;
  var totalTime = 0;
  for (let i = 0; i < times.length; i++) {
    const t = times[i];
    if (t.e !== undefined) {
      totalTime += (t.e - t.s) / 1000;
    }
  }
  const countDown = useCountdown(startTime);

  var displayTime = totalTime;
  if (active) {
    displayTime += countDown.ts;
  }

  return <Typography variant={"h6"}>{humanize(displayTime)}</Typography>;
};

const Timer = ({ startTime }) => {
  const countDown = useCountdown(startTime);

  return (
    <Typography variant={"h6"} display={"inline"}>
      {countDown.h}:{countDown.m}:{countDown.s}
    </Typography>
  );
};

function App(props) {
  console.log("Props", props);
  const taskList = Object.values(props.tasks);
  const [search, setSearch] = useState("");
  const [modal, toggleModal] = useState({ show: false, value: null });
  const [date, setDate] = useState(null);

  console.log("Date", date);
  const onStart = (task) => {
    props.startTask(task);
  };

  const onEnd = (task) => {
    props.endTask(task);
  };

  const onDelete = (task) => {
    props.removeTask(task);
  };
  const onEdit = (task) => {
    toggleModal({ show: true, value: task });
  };

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const addTaskCLick = () => {
    toggleModal({ ...modal, show: true });
  };

  const displayList = taskList
    .filter((value) => {
      return value.name.includes(search) || value.tags.indexOf(search) !== -1;
    })
    .filter((value) => {
      if (!date) {
        return true;
      }

      return (
        moment(value.time).format("YYYY-MM-DD") == date.format("YYYY-MM-DD")
      );
    });

  const taskListItem = (value) => {
    const { times, tags } = value;
    const active = times.length > 0 && times[times.length - 1].e === undefined;
    const dTags = tags.length > 3 ? tags.slice(0, 3) : tags;
    return (
      <React.Fragment>
        <TableRow>
          <TableCell>
            <Typography variant={"h4"} gutterBottom>
              {value.name}
            </Typography>
          </TableCell>
          <TableCell align={"right"}>
            <Typography variant={"h6"}>{value.date}</Typography>
          </TableCell>

          <TableCell>
            {dTags.map((v) => (
              <Chip label={v} />
            ))}
          </TableCell>

          <TableCell align="right">
            {value.times.length != 0 &&
            value.times[value.times.length - 1].e === undefined ? (
              <TotalTime
                startTime={value.times[value.times.length - 1].s}
                times={value.times}
              />
            ) : (
              <TotalTime startTime={0} times={value.times} />
            )}
          </TableCell>
          <TableCell align={"right"}>
            {value.times.length != 0 &&
            value.times[value.times.length - 1].e === undefined ? (
              <Timer startTime={value.times[value.times.length - 1].s} />
            ) : (
              <Typography variant={"h6"} display={"inline"}>
                0:0:0
              </Typography>
            )}
          </TableCell>

          <TableCell align={"right"}>
            {active ? (
              <IconButton
                aria-label="menu"
                onClick={() => {
                  onEnd(value);
                }}
              >
                <StopIcon />
              </IconButton>
            ) : (
              <IconButton
                aria-label="menu"
                onClick={() => {
                  onStart(value);
                }}
              >
                <PlayArrowIcon />
              </IconButton>
            )}
            <IconButton
              aria-label="menu"
              onClick={() => {
                onDelete(value);
              }}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              aria-label="menu"
              onClick={() => {
                onEdit(value);
              }}
            >
              <EditIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };
  return (
    <Container justify="center" alignItems="center">
      <Typography variant={"h1"} align={"center"} gutterBottom>
        Time Tracker!
      </Typography>

      <SearchBar onChange={onSearchChange} addTaskClick={addTaskCLick} />
      <Grid
        container
        direction="row"
        justify={date ? "space-between" : "flex-end"}
        alignItems="center"
        style={{ padding: "10px" }}
      >
        {date && (
          <Chip
            label={"Showing Tasks for Date " + date.format("LL")}
            onDelete={() => {
              setDate(null);
            }}
          />
        )}
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="LL"
          margin="normal"
          id="date-picker-inline"
          label="Filter By Date"
          value={date}
          onChange={setDate}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </Grid>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Task Name</TableCell>
            <TableCell align={"right"}>Created on</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell align="right">Total Time</TableCell>
            <TableCell align="right">Timer</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        {displayList.map(taskListItem)}
      </Table>
      <div>
        <Modal
          open={modal.show}
          onClose={() => {
            toggleModal({ show: !modal.show, value: null });
          }}
        >
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            style={{ minHeight: "100vh" }}
          >
            <Paper>
              <CreateTaskForm
                modal={modal}
                props={props}
                toggleModal={toggleModal}
              />
            </Paper>
          </Grid>
        </Modal>
      </div>
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    tasks: state.tasks,
  };
};

export default connect(mapStateToProps, { ...actions })(App);
