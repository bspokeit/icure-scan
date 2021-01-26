import createContext from './createContext';

const importReducer = (state, action) => {
  switch (action.type) {
    case 'collect_document':
      return {
        ...state,
        patientDocuments: [...state.patientDocuments, action.payload],
      };
    case 'clear_documents':
      return { ...state, patientDocuments: [] };
    case 'set_import_mode':
      return { ...state, importMode: action.payload };
    case 'set_import_status':
      return { ...state, importStatus: action.payload };
    case 'set_import_tasks':
      return { ...state, importTasks: action.payload };
    case 'update_task_status':
      const updatedTasks = [...state.importTasks].map((t) => {
        if (t.id === action.payload.id) {
          t.importStatus = action.payload.status;
        }
        return t;
      });
      return { ...state, importTasks: updatedTasks };
    case 'set_closing_task':
      return { ...state, closingTask: action.payload };
    default:
      return state;
  }
};

const collectDocument = (dispatch) => async (document) => {
  dispatch({ type: 'collect_document', payload: document });
};

const clearDocuments = (dispatch) => async () => {
  dispatch({ type: 'clear_documents' });
};

const setImportMode = (dispatch) => async (importMode) => {
  dispatch({ type: 'set_import_mode', payload: importMode });
};

const setImportStatus = (dispatch) => async (status) => {
  dispatch({ type: 'set_import_status', payload: status });
};

const setImportTasks = (dispatch) => async (tasks) => {
  dispatch({ type: 'set_import_tasks', payload: tasks });
};

const setClosingTask = (dispatch) => async (task) => {
  dispatch({ type: 'set_closing_task', payload: task });
};

const updateTaskStatus = (dispatch) => async (id, status) => {
  dispatch({ type: 'update_task_status', payload: { id, status } });
};

export const { Provider, Context } = createContext(
  importReducer,
  {
    collectDocument,
    clearDocuments,
    setImportMode,
    setImportStatus,
    setImportTasks,
    updateTaskStatus,
    setClosingTask,
  },
  {
    patientDocuments: [],
    importMode: false,
    importStatus: 'PENDING',
    importTasks: [],
    closingTask: null,
  }
);
