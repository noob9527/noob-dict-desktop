import React, { useState, useEffect, useReducer } from 'react';
import { Search } from './search';
import { BingView } from "../dictionaries/bing/View";

export const SearchPanel: React.FC = () => {
  return (
    <>
      <Search/>
    </>
  );
};
