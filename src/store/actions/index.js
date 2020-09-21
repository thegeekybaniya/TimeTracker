import * as actionsTypes from "../constants";

export const createTask = (task) => ({ type: actionsTypes.CREATE_TASK, task });

export const updateTask = (task) => ({ type: actionsTypes.UPDATE_TASK, task });
export const updateTaskStart = (task) => ({
  type: actionsTypes.UPDATE_TASK_START,
  task,
});
export const updateTaskCancel = () => ({
  type: actionsTypes.UPDATE_TASK_CANCEL,
});

export const removeTask = (task) => ({ type: actionsTypes.REMOVE_TASK, task });

export const startTask = (task) => ({ type: actionsTypes.START_TASK, task });

export const endTask = (task) => ({ type: actionsTypes.END_TASK, task });
