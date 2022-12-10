const actions = {
  INIT: 'init',
};

const initialState = {
  addressProviderContract: null,
  rolesManagerContract: null,
  folderFactoryContract: null,
  getFolderHandlerContract: null,
  documentHandlerContract: null,
};

const reducer = (state, action) => {
  const { type, data } = action;

  switch (type) {
    case actions.INIT:
      return { ...state, ...data };
    default:
      // throw new Error('Undefined reducer action type');
      return { ...state };
  }
};

export { actions, initialState, reducer };
