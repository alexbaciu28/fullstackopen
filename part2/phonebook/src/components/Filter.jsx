const Filter = (props) => {
  return (
    <div>filter show with <input value={props.newFilter} 
            onChange={props.handleFilterChange}/></div>
  )
}

export default Filter