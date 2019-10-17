import React from 'react';
import styles from './search.module.scss';
import SearchHeaderInput from "./SearchHeaderInput";

export default () => {
  return (
    <div className={styles.searchHeader}>
      <SearchHeaderInput/>
    </div>
  );

}

