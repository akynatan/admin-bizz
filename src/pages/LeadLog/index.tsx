/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';

import moment from 'moment';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import MenuHeader from '../../components/MenuHeader';
import { Container, Content, HeaderPage } from './styles';
import api from '../../services/api';
import { LeadLog } from '../../types/LeadLog';

const LeadLogs: React.FC = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [leadLogFiltered, setLeadLogFiltered] = useState<LeadLog[]>([]);

  useEffect(() => {
    api
      .get('/lead/undefined/logs')
      .then(res => {
        setLeadLogFiltered(res.data);
      })
      .finally(() => {
        setIsFetching(true);
      });
  }, []);

  return (
    <Container>
      <MenuHeader />

      <Content>
        <HeaderPage>
          <div>
            <h1>Logs do Lead</h1>
            <hr />
          </div>
        </HeaderPage>

        <table>
          <thead>
            <tr className="table100-head">
              <th>ID</th>
              <th>Description</th>
              <th>Created At</th>
              <th>Acessar RD</th>
            </tr>
          </thead>
          <tbody>
            {leadLogFiltered.map(lead => {
              return (
                <tr key={lead.id}>
                  <td className="column2">{lead.id}</td>
                  <td className="column1">{lead.description}</td>
                  <td className="column2">
                    {moment(lead.created_at).format('DD/MM/YYYY HH:mm:SS')}
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

export default LeadLogs;
