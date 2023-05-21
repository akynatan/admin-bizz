/* eslint-disable no-useless-escape */
import React, { useCallback, useRef, useEffect, useState } from 'react';
import { FiMail, FiUser, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Select from '../Select';
import Input from '../Input';
import Button from '../Button';

import { FormGroup, FormGroupBlock } from './styles';

import { Option, City, User } from '../../types';

const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'Vendedor', value: 'seller' },
  { label: 'Supervisor', value: 'supervisor' },
  { label: 'Gerente', value: 'manager' },
];

interface ICityOption extends City, Option {}

interface IManagerOption extends User, Option {}

interface ISupervisorOption extends User, Option {}

interface AddUserFormData {
  name: string;
  email: string;
  password: string;
  user_id_rd: string;
  role: string;
  city_id: string;
  manager_id: string;
  new_password?: string;
  supervisor: string[] | string;
}

interface FormUserProps {
  initialData?: any;
  method: 'edit' | 'add';
  url: string;
}

const FormUser: React.FC<FormUserProps> = ({ initialData, method, url }) => {
  const { addToast } = useToast();
  const history = useHistory();
  const [cities, setCities] = useState<ICityOption[]>([]);
  const [managers, setManagers] = useState<IManagerOption[]>([]);
  const [supervisors, setSupervisors] = useState<ISupervisorOption[]>([]);

  const formRef = useRef<FormHandles>(null);

  useEffect(() => {
    api.get(`/city`).then(responseCity => {
      const CitiesData = responseCity.data.map((cityCurrent: City) => ({
        ...cityCurrent,
        value: cityCurrent.id,
        label: cityCurrent.name,
      }));

      setCities(CitiesData);
    });
  }, []);

  useEffect(() => {
    api.get(`/users?role=manager`).then(responseManager => {
      const ManagersData = responseManager.data.map((managerCurrent: User) => ({
        ...managerCurrent,
        value: managerCurrent.id,
        label: managerCurrent.name,
      }));

      setManagers(ManagersData);
    });
  }, []);

  useEffect(() => {
    api.get(`/users?role=supervisor`).then(responseSupervisors => {
      const supervisorsData = responseSupervisors.data.map(
        (supervisorCurrent: User) => ({
          ...supervisorCurrent,
          value: supervisorCurrent.id,
          label: supervisorCurrent.name,
        }),
      );

      setSupervisors(supervisorsData);
    });
  }, []);

  const handleSubmit = useCallback(
    async (data: AddUserFormData) => {
      formRef.current?.setErrors({});
      try {
        const shapes: any = {
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          user_id_rd: Yup.string(),
          role: Yup.string().required('Papel obrigatório'),
          city_id: Yup.string(),
          manager_id: Yup.string(),
        };

        if (method === 'add') {
          shapes.password = Yup.string().required('Senha obrigatório');
        }

        if (method === 'edit') {
          shapes.new_password = Yup.string();
        }

        const schema = Yup.object().shape(shapes);

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          password,
          user_id_rd,
          role,
          city_id,
          manager_id,
          new_password,
          supervisor,
        } = data;

        const formData: any = {
          name,
          email,
          user_id_rd: user_id_rd !== '' ? user_id_rd : null,
          role: role !== '' ? role : null,
          city_id: city_id !== '' ? city_id : null,
          manager_id: manager_id !== '' ? manager_id : null,
          supervisors: supervisor !== '' ? supervisor : [],
        };

        if (method === 'add') {
          formData.password = password;
        }

        if (method === 'edit') {
          formData.new_password = new_password !== '' ? new_password : null;
        }

        const methods = {
          edit: async () => api.put(url, formData),
          add: async () => api.post(url, formData),
        };

        const response = await methods[method]();

        if (response.data) {
          addToast({
            type: 'success',
            title: 'Usuário Cadastrado/Alterado!',
            description: 'Novo usuário cadastrado/alterado com sucesso!',
          });
        }

        history.push('/users');
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no Cadastro/Atualização!',
          description: err.response?.data?.error,
        });
      }
    },
    [addToast, url, method, history],
  );

  return (
    <Form initialData={initialData} ref={formRef} onSubmit={handleSubmit}>
      <FormGroup>
        <FormGroupBlock>
          <h2>Dados pessoais:</h2>
          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="Email" />
          {method === 'add' && (
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />
          )}
          <Input name="user_id_rd" placeholder="User ID RD" />
          <Select name="role" placeholder="Tipo" options={roles} />
          <Select name="manager_id" placeholder="Gerente" options={managers} />
          <Select
            name="city_id"
            placeholder="Cidade"
            options={cities}
            component="creatable"
          />
          <Select
            name="supervisor"
            placeholder="Supervisores"
            isMulti
            options={supervisors}
          />

          {method === 'edit' && (
            <Input
              name="new_password"
              icon={FiLock}
              type="password"
              placeholder="Nova Senha (reset)"
            />
          )}
        </FormGroupBlock>
      </FormGroup>

      <div>
        <Button type="submit">Atualizar Usuário</Button>
      </div>
    </Form>
  );
};

export default FormUser;
