import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { getUsers } from "../../api/user";

const Users = () => {
  const [users, setUsers] = useState([]);

  console.log(users);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getUsers(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setUsers(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <div className='container'>
      <div className='row'>
        <h2 className='tet-center mt-3'>All users</h2>

        <Table striped bordered hover className='mt-4'>
          <thead>
            <tr>
              <th>S.N</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Users;
