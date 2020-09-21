import * as actionsTypes from "../constants";
import { v4 } from "uuid";

const addTask = (oldState, action) => {
  const newState = { ...oldState };
  const newId = v4();
  newState[newId] = { id: newId, times: [], ...action.task };
  return newState;
};

const removeTask = (oldState, action) => {
  const newState = { ...oldState };
  delete newState[action.task.id];
  return newState;
};

const startTask = (oldState, action) => {
  const newState = { ...oldState };
  const taskToUpdate = newState[action.task.id];
  taskToUpdate.times.push({ s: Date.now() });
  return newState;
};

const endTask = (oldState, action) => {
  const newState = { ...oldState };
  const taskToEnd = newState[action.task.id];
  taskToEnd.times[taskToEnd.times.length - 1] = {
    ...taskToEnd.times[taskToEnd.times.length - 1],
    e: Date.now(),
  };
  newState[action.task.id] = taskToEnd;
  return newState;
};

const updateTask = (oldState, action) => {
  const newState = { ...oldState };
  newState[action.task.id] = action.task;
  return newState;
};

const tasks = (state = {}, action) => {
  switch (action.type) {
    case actionsTypes.CREATE_TASK:
      return addTask(state, action);
    case actionsTypes.REMOVE_TASK:
      return removeTask(state, action);
    case actionsTypes.START_TASK:
      return startTask(state, action);
    case actionsTypes.END_TASK:
      return endTask(state, action);
    case actionsTypes.UPDATE_TASK:
      return updateTask(state, action);
    default:
      return state;
  }
};

export default tasks;
