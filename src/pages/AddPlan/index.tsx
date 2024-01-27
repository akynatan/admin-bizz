/* eslint-disable no-useless-escape */
import React from 'react';

import FormPlan from '../../components/FormPlan';
import GoBack from '../../components/GoBack';

import { Container, Content, ContentPage } from './styles';
import MenuHeader from '../../components/MenuHeader';

const AddPlan: React.FC = () => {
  return (
    <Container>
      <MenuHeader />

      <ContentPage>
        <Content>
          <GoBack />

          <h1>Novo Plano</h1>

          <FormPlan url="/plans" method="add" />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default AddPlan;
