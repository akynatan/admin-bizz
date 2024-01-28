/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import { HiPencil } from 'react-icons/hi';
import { FiPlusCircle } from 'react-icons/fi';
import MenuHeader from '../../components/MenuHeader';
import { Container, Content, HeaderPage } from './styles';
import api from '../../services/api';
import { User } from '../../types/User';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/auth';

const roles = {
  admin: 'Admin',
  seller: 'Vendedor',
  supervisor: 'Supervisor',
  manager: 'Gerente',
};

const Users: React.FC = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api
      .get('/users')
      .then(res => {
        setUsers(res.data);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  return (
    <Container>
      <MenuHeader />

      <Content>
        <HeaderPage>
          <div>
            <h1>Lista de Users</h1>
            <hr />
          </div>
          <Link to="user/add">
            <Button type="button">Adicionar Cliente</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <table>
          <thead>
            <tr className="table100-head">
              <th>Nome</th>
              <th>Email</th>
              <th>Função</th>
              <th>Gerente</th>
              <th>Cidade</th>
              <th>Supervisores</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              return (
                <tr key={user.id}>
                  <td className="column2">{user.name}</td>
                  <td className="column1">{user.email}</td>
                  <td className="column1">
                    {user.role ? roles[user.role] : '-'}
                  </td>
                  <td className="column1">{user.manager?.name || '-'}</td>
                  <td className="column1">{user.city?.name || '-'}</td>
                  <td className="column1">
                    {user.supervisors
                      .map(sup => sup.supervisor.name)
                      .join(', ')}
                  </td>
                  <td>
                    <Link
                      style={{
                        textDecoration: 'none',
                        fontWeight: 600,
                        color: '#ff9000',
                      }}
                      to={`user/${user.id}`}
                      title="Editar Cliente"
                    >
                      <HiPencil />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {isFetching && <p className="fetching">Carregando...</p>}
      </Content>
    </Container>
  );
};

export default Users;
