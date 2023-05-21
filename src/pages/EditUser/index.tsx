/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import api from '../../services/api';

import FormUser from '../../components/FormUser';
import GoBack from '../../components/GoBack';
import MenuHeader from '../../components/MenuHeader';

import { User } from '../../types';

import { Container, ContentPage, Content } from './styles';

const roles = {
  admin: 'Admin',
  seller: 'Vendedor',
  supervisor: 'Supervisor',
  manager: 'Gerente',
};

const EditUser: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    api.get(`/users/${id}`).then(response => {
      setUser(response.data);
    });
  }, [id]);

  return (
    <Container>
      <MenuHeader />

      <ContentPage>
        <Content>
          <GoBack />

          <h1>Editar Usuário</h1>

          <FormUser
            initialData={{
              name: user?.name,
              email: user?.email,
              password: user?.password,
              user_id_rd: user?.user_id_rd,
              role: user?.role
                ? {
                    label: roles[user?.role],
                    value: user?.role,
                  }
                : null,
              city_id: user?.city
                ? {
                    ...user?.city,
                    label: user?.city?.name,
                    value: user?.city?.id,
                  }
                : null,
              manager_id: user?.manager
                ? {
                    ...user?.manager,
                    label: user?.manager?.name,
                    value: user?.manager?.id,
                  }
                : null,
              supervisor: user?.supervisors
                ? user.supervisors.map(sup => ({
                    label: sup.supervisor.name,
                    value: sup.supervisor.id,
                    ...sup.supervisor,
                  }))
                : null,
              avatar: user?.avatar,
            }}
            url={`/users/${id}`}
            method="edit"
          />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default EditUser;
