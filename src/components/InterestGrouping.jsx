import React, { useState, useEffect} from 'react';

const InterestGrouping = ({users}) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const groupedUsers = groupByInterests(users);
    setGroups(groupedUsers);
  }, [users]);


  const groupByInterests = (users) => {
    const interestMap = {};

    // Group users by interests
    users.forEach((user) => {
      user.interests.forEach((interest) => {
        if (!interestMap[interest]) {
          interestMap[interest] = [];
        }
        interestMap[interest].push(user);
      });
    });

    // Convert the interest map to an array of groups
    const groupArray = [];
    Object.keys(interestMap).forEach((interest) => {
      const group = {
        interest,
        users: interestMap[interest],
      };
      groupArray.push(group);
    });

    return groupArray;
  };

  return (
    <div>
    <h2>Interest Groups</h2>
    <table>
        <thead>
        <tr>
            <th>Interest</th>
            <th>Users</th>
        </tr>
        </thead>
        <tbody>
        {groups.map((group, index) => (
            <tr key={index}>
            <td>{group.interest}</td>
            <td>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {group.users.map((user, idx) => (
                    <li key={idx}>{user.name}</li>
                ))}
                </ul>
            </td>
            </tr>
        ))}
        </tbody>
    </table>
    </div>
  );
};

export default InterestGrouping;