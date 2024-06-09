import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const baseURL = 'http://localhost:8000';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/users/`);
        console.log(response.data)
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/groups/`);
        console.log(response.data, 'group data')
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchUsers();
    fetchGroups();
  }, []);

  useEffect(() => {
    const filtered = groups.filter(group =>
      group.group_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGroups(filtered);
  }, [searchQuery, groups]);

  const handleGroupClick = (groupId) => {
    // Navigate to the chat section for the clicked group
    console.log(`Navigating to chat for group with ID: ${groupId}`);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };


  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseURL}/api/groups/`, {
        group_name: newGroupName,
        users: selectedUsers, // Include the selected user IDs
      });
      console.log('New group created:', response.data);
      setGroups([...groups, response.data]);
      setNewGroupName('');
      setSelectedUsers([]); // Reset the selected users after group creation
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

const handleJoinGroup = async (groupId) => {
  try {
    const response = await axios.post(`${baseURL}/api/groups/${groupId}/join/`, {
      userId: 1
    });
    console.log('Joined group:', response.data);
    // Update the groups state with the updated group data
    const updatedGroups = groups.map((group) =>
      group.id === groupId ? response.data : group
    );
    setGroups(updatedGroups);
  } catch (error) {
    console.error('Error joining group:', error);
  }
};

  return (
    <div>
    <h1>Admin Dashboard</h1>
    <h2>Users</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Interests</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.interests ? user.interests.join(', ') : 'No interests provided'}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <h2>Groups</h2>
      <div>
        <h3>Create New Group</h3>
        <form onSubmit={handleCreateGroup}>
          <input
            type="text"
            placeholder="Enter group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <div>
            <h4>Select Users</h4>
            {users.map((user) => (
              <div key={user.id}>
                <input
                  type="checkbox"
                  id={`user-${user.id}`}
                  checked={selectedUsers.includes(user.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers([...selectedUsers, user.id]);
                    } else {
                      setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
                    }
                  }}
                />
                <label htmlFor={`user-${user.id}`}>{user.name}</label>
              </div>
            ))}
          </div>
          <button type="submit" disabled={newGroupName.trim() === '' || selectedUsers.length === 0}>
            Create Group
          </button>
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>Group Name</th>
            <th>Users</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr key={group.id}>
              <td>
                <strong onClick={() => handleGroupClick(group.id)}>
                  {group.group_name}
                </strong>
              </td>
              <td>
                <ul>
                  {group.users.map((userId) => {
                    const user = users.find((user) => user.id === userId);
                    return <li key={user.id}>{user.name}</li>;
                  })}
                </ul>
              </td>
              <td>
                <button onClick={() => handleJoinGroup(group.id)}>Join Group</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    <div className="search-container">
      <h2>Search for Other Groups</h2>
      <input
        type="text"
        placeholder="Search groups..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />
      <ul className="filtered-groups">
        {filteredGroups.map((group) => (
          <li key={group.id}>
            <strong>{group.group_name}</strong>
          </li>
        ))}
      </ul>
    </div>
  </div>
  );
};

export default AdminDashboard;