import { createSlice } from '@reduxjs/toolkit';
import { combineReducers, createStore } from 'redux';

import metadataReducer from './reducers/metadata';

export default createStore(combineReducers({ metadata: metadataReducer }));
