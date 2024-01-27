/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import api from '../../services/api';

import FormPlan from '../../components/FormPlan';
import GoBack from '../../components/GoBack';
import MenuHeader from '../../components/MenuHeader';

import { Plan } from '../../types';

import { Container, ContentPage, Content } from './styles';

const EditPlan: React.FC = () => {
  const [plan, setPlan] = useState<Plan | null>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    api.get(`/plans/${id}`).then(response => {
      setPlan(response.data);
    });
  }, [id]);

  return (
    <Container>
      <MenuHeader />

      <ContentPage>
        <Content>
          <GoBack />

          <h1>Editar Plano</h1>

          <FormPlan
            initialData={{
              plan_name: plan?.plan_name,
              template_id_click: plan?.template_id_click,
              plan_id_rd: plan?.plan_id_rd,
            }}
            url={`/plans/${id}`}
            method="edit"
          />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default EditPlan;
