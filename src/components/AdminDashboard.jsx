import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/AdminDashboard.css';

const AdminDashboard = ({currentUser}) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentGroupName, setCurrentGroupName] = useState('');

  const baseURL = 'http://localhost:8000';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/users/`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/groups/`);
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
    const group = groups.find(g => g.id === groupId);
    localStorage.setItem('groupId', JSON.stringify(groupId));
    if (group) {
      navigate(`/group-chat/${groupId}`, { state: { group } });
    }

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
      userId: currentUser.id
    });
    if (response.data) { 
      const updatedGroups = groups.map((group) =>
        group.id === groupId ? response.data : group
      );
      setGroups(updatedGroups);
      setCurrentGroupName(response.data.group_name);
      navigate(`/group-chat/${groupId}`, { state: { group: response.data } });
    } else {
      console.error('Error joining group: Response data is empty');
    }
  } catch (error) {
    console.error('Error joining group:', error);
  }
};

  return (
    <div>
      <div>
        {currentUser ? (
          <>
            <h2>Welcome, {currentUser.name}!</h2>
            <h3>Your Groups</h3>
            <ul className="no-bullets">
              {currentUser.groups.map((group) => (
                <li key={group.id}>
                  <strong onClick={() => handleGroupClick(group.id)}>{group.group_name}</strong>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
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
          {groups && groups.map((group) => (
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