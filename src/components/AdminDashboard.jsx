import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import { getCsrfToken } from '../csrf';
import '../css/AdminDashboard.css';
import axiosInstance from '../axiosInstance';

const AdminDashboard = ({currentUser}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentGroupName, setCurrentGroupName] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editInterests, setEditInterests] = useState('');
  const [editPassword, setEditPassword] = useState('');
  
  // const user = location.state?.user || currentUser || { id: null, name: '', groups: [] };
  const [user, setUser] = useState(location.state?.user || currentUser || { id: null, name: '', groups: [] });
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
    const filtered = groups?.filter(group =>
      group.group_name?.toLowerCase().includes(searchQuery?.toLowerCase())
    );
    setFilteredGroups(filtered);
  }, [searchQuery, groups]);

  const handleGroupClick = (groupId) => {
    const group = groups?.find(g => g.id === groupId);
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
        users: selectedUsers, 
      });
      
      setGroups([...groups, response.data]);
      setNewGroupName('');
      setSelectedUsers([]); 
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  //Joining a group
  const handleJoinGroup = async (groupId) => {
    try {
      const response = await axios.post(`${baseURL}/api/groups/${groupId}/join/`, {
        userId: currentUser.id
      });
      if (response.data) {
        const updatedGroups = groups.map(group =>
          group.id === groupId ? response.data : group
        );
        setGroups([...groups, updatedGroups]);
  
        const updatedUserGroups = [...user.groups, response.data];
        setUser(prevUser => ({ ...prevUser, groups: updatedUserGroups }));
  
        navigate(`/group-chat/${groupId}`, { state: { group: response.data } });
      } else {
        console.error('Error joining group: Response data is empty');
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

//Leaving a group
const handleLeaveGroup = async (groupId) => {
  const csrfToken = await getCsrfToken();
  try {
    await axios.post(
      `${baseURL}/api/users/${user.id}/leave_group/`,
      { group_id: groupId },
      {
        headers: {
          'X-CSRFToken': csrfToken,
        },
      }
    );
    const updatedGroups = groups.filter(group => group.id !== groupId);
    setGroups(updatedGroups);

    const updatedUserGroups = user.groups.filter(group => group.id !== groupId);
    setUser(prevUser => ({ ...prevUser, groups: updatedUserGroups }));
  } catch (error) {
    console.error('Error leaving group:', error);
  }
};


// CRUD FOR THE USERS
const handleDeleteUser = async (userId) => {
  const csrfToken = await getCsrfToken();
  try {
    await axiosInstance.delete(`/api/users/${userId}/`,{
      headers: {
        'X-CSRFToken': csrfToken,
      }
    });
    setUsers(users.filter(user => user.id !== userId));
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

const handleEditUser = (user) => {
  setEditingUser(user.id);
  setEditName(user.name || '');
  setEditInterests(user.interests ? user.interests.join(', ') : '');
  setEditPassword('');
};

const handleSaveEdit = async () => {
  const csrfToken = await getCsrfToken();
  try {
    const updateData = {};
    if (editName !== '') {
      updateData.username = editName;
    }
    if (editInterests !== '') {
      updateData.interests = editInterests.split(',').map(interest => interest.trim());
    }
    if (editPassword !== '') {
      updateData.password = editPassword;
    }
    const response = await axiosInstance.patch(`${baseURL}/api/users/${editingUser}/`, updateData, {
      headers: {
        'X-CSRFToken': csrfToken,
      }
    });
    setUsers(users.map(user => user.id === editingUser ? response.data : user));
    setEditingUser(null);
    setEditName('');
    setEditInterests('');
    setEditPassword('');
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

return (
    <div>
      <div>
      {user ? (
          <>
            <h2>Welcome, {user.name}!</h2>
            <h3>Your Groups</h3>
            {user.groups && user.groups.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Group Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {user.groups.map(group => (
                    <tr key={group.id}>
                      <td>
                        <strong
                          onClick={() => handleGroupClick(group.id)}
                          style={{
                            cursor: 'pointer',
                            color: 'blue',
                            textDecoration: 'underline'
                          }}
                          onMouseEnter={(e) => e.target.style.color = 'navy'}
                          onMouseLeave={(e) => e.target.style.color = 'blue'}
                        >
                          {group.group_name}
                        </strong>
                      </td>
                      <td>
                        <button onClick={() => handleLeaveGroup(group.id)}>Leave Group</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>You are not currently in any groups.</p>
            )}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <hr />
    <h2>Users</h2>
    <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Interests</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                {editingUser === user.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editingUser === user.id ? (
                  <input
                    type="text"
                    value={editInterests}
                    onChange={(e) => setEditInterests(e.target.value)}
                  />
                ) : (
                  user.interests ? user.interests.join(', ') : 'No interests provided'
                )}
              </td>
              <td>
                {editingUser === user.id ? (
                  <>
                    <input
                      type="password"
                      placeholder="Enter new password (optional)"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                    />
                    <button onClick={handleSaveEdit} style={{ marginRight: '10px' }}>Save</button>
                    <button onClick={() => setEditingUser(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditUser(user)} style={{ marginRight: '10px' }}>Edit</button>
                    <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                  </>
                )}
              </td>
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
                {group.users?.map((userId) => ( 
                  <li key={userId}>{users.find((user) => user.id === userId)?.name}</li>
                ))}
                {!group.users?.length && <li>No users in this group.</li>}
                </ul>
              </td>
              <td>
              {group.users?.includes(currentUser.id) ? (
                <button className="button-joined" disabled>Joined</button>
              ) : (
                <button onClick={() => handleJoinGroup(group.id)}>Join Group</button>
              )}
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