import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "index";

import { IContactResponse } from "interface";
import { getContact } from "mutation";

export const loadContacts = createAsyncThunk(
  "@@contacts/load-contacts",
  async () => {
    let data: any = await client
      .query({ query: getContact })
      .then((res) => res.data.getContacts);
    return data;
  }
);

interface IContactState {
  contacts: IContactResponse | null;
  status: string;
}

const initialState: IContactState = {
  contacts: null,
  status: "idle",
};

export const contactsSlice = createSlice({
  initialState,
  name: "contactsSlice",
  reducers: {
    actionClearContact: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadContacts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadContacts.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(loadContacts.fulfilled, (state, action) => {
        state.status = "received";
        state.contacts = action.payload as unknown as IContactResponse;
      });
  },
});

export const contactReducer = contactsSlice.reducer;

export const { actionClearContact } = contactsSlice.actions;

export const getContacts = (state) => state.contacts.contacts;
