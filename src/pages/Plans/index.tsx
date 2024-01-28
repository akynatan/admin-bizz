/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import { HiPencil } from 'react-icons/hi';
import { FiPlusCircle } from 'react-icons/fi';
import MenuHeader from '../../components/MenuHeader';
import { Container, Content, HeaderPage } from './styles';
import api from '../../services/api';
import { Plan } from '../../types/Plan';
import Button from '../../components/Button';

const Plans: React.FC = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    api
      .get('/plans')
      .then(res => {
        setPlans(res.data);
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
            <h1>Lista de Planos</h1>
            <hr />
          </div>
          <Link to="plan/add">
            <Button type="button">Adicionar Plano</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <table>
          <thead>
            <tr className="table100-head">
              <th>Nome</th>
              <th>Template Click</th>
              <th>ID RD Station</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => {
              return (
                <tr key={plan.id}>
                  <td className="column1">{plan.plan_name}</td>
                  <td className="column1">{plan.template_id_click}</td>
                  <td className="column1">{plan.plan_id_rd}</td>
                  <td className="column1">
                    <Link
                      style={{
                        textDecoration: 'none',
                        fontWeight: 600,
                        color: '#ff9000',
                      }}
                      to={`plan/${plan.id}`}
                      title="Editar Plano"
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

export default Plans;
