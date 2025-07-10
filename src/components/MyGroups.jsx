import React from 'react'

const MyGroups = ({groups, setGroups, displayList}) => {
  return (
    <div>
      {displayList("Groups", groups)}
    </div>
  )
}

export default MyGroups
