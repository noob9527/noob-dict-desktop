import React from 'react';
import { Button, Input } from 'antd';

interface FilterDropDownProps {
  setSelectedKeys: any
  selectedKeys: any
  confirm: any
  clearFilters: any
}

export const FilterDropDown: React.FC<FilterDropDownProps> = (props) => {
  const {
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  } = props;


  function handleReset() {
    clearFilters()
  }

  function handleSearch() {
    confirm()
  }

  return (
    <div style={{ padding: 8 }}>
      <Input
        // ref={node => {
        //   searchInput = node;
        // }}
        // placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        // onChange={e => onChange(e.target.value)}
        onPressEnter={handleSearch}
        style={{ width: 188, marginBottom: 8, display: 'block' }}
      />
      <Button
        type="primary"
        onClick={handleSearch}
        icon="search"
        size="small"
        style={{ width: 90, marginRight: 8 }}
      >
        Search
      </Button>
      <Button onClick={handleReset} size="small" style={{ width: 90 }}>
        Reset
      </Button>
    </div>
  )
}