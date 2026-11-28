import { Priority } from '../enums/priority';

export const getPriorityTitle = (priority: number) => {
  switch (priority) {
    case 3:
      return Priority.HIGH;
    case 2:
      return Priority.MEDIUM;
    default:
      return Priority.LOW;
  }
};
