/* eslint-disable no-alert */
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import { FiUpload, FiLink, FiArrowUpCircle, FiBook } from 'react-icons/fi';
import moment from 'moment';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import MenuHeader from '../../components/MenuHeader';
import InputSample from '../../components/InputSample';
import {
  Container,
  Content,
  HeaderPage,
  AvatarInput,
  Calendar,
} from './styles';
import api from '../../services/api';
import { Lead } from '../../types/Lead';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

const Leads: React.FC = () => {
  const { addToast } = useToast();
  const [isFetching, setIsFetching] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsFiltered, setLeadsFiltered] = useState<Lead[]>([]);
  const [leadNameFilter, setLeadNameFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | null>(new Date());
  const { user } = useAuth();

  useEffect(() => {
    api
      .get('/leads')
      .then(res => {
        setLeads(res.data);
        setLeadsFiltered(res.data);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  useEffect(() => {
    let leadsFilteredToSet = leads;

    if (leadNameFilter !== '') {
      leadsFilteredToSet = leads.filter(lead =>
        lead.name.toLowerCase().includes(leadNameFilter.toLowerCase()),
      );
    }

    if (dateFilter) {
      leadsFilteredToSet = leadsFilteredToSet.filter(lead => {
        return (
          moment(lead.created_at).format('DD/MM/YYYY') ===
          moment(dateFilter).format('DD/MM/YYYY')
        );
      });
    }

    setLeadsFiltered(leadsFilteredToSet);
  }, [leads, dateFilter, leadNameFilter]);

  const handleProofOfResidence = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const data = new FormData();

      const { files } = e.target;
      const lead_id = e.target.getAttribute('data-lead_id');

      if (files) {
        data.append('file', files[0]);

        api.patch(`/leads/${lead_id}/proofofresidence`, data).then(() => {
          addToast({
            type: 'success',
            title: 'Comprovante de Residência alterado!',
          });
        });
      }
    },
    [addToast],
  );

  const handleProofOfIdentity = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const data = new FormData();

      const { files } = e.target;
      const lead_id = e.target.getAttribute('data-lead_id');

      if (files) {
        data.append('file', files[0]);

        api.patch(`/leads/${lead_id}/proofofidentity`, data).then(() => {
          addToast({
            type: 'success',
            title: 'Comprovante de Identidade alterado!',
          });
        });
      }
    },
    [addToast],
  );

  const retryDocument = useCallback(
    lead_id => {
      api.post(`/leads/${lead_id}/create`).then(() => {
        addToast({
          type: 'success',
          title: 'Novo documento criado!',
        });
      });
    },
    [addToast],
  );

  const createCardHubSoft = useCallback(
    lead_id => {
      api.post(`/leads/${lead_id}/createcardhub`).then(() => {
        addToast({
          type: 'success',
          title: 'CardID criado com sucesso!',
        });
      });
    },
    [addToast],
  );

  return (
    <Container>
      <MenuHeader />

      <Content>
        <HeaderPage>
          <div>
            <h1>Lista de Leads</h1>
            <hr />
          </div>
        </HeaderPage>

        <div
          style={{
            margin: '24px 0',
            display: 'flex',
            gap: 24,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Nome:
            </span>
            <InputSample
              name="lead_name"
              containerStyle={{ width: 300, height: 20 }}
              onChange={e => setLeadNameFilter(e.target.value)}
            />
          </div>
          <div>
            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                Data de cadastro:
              </span>
              <Calendar>
                <DatePicker
                  closeCalendar={false}
                  onChange={(value: any) => {
                    setDateFilter(value);
                  }}
                  format="dd-MM-y"
                  value={dateFilter}
                />
              </Calendar>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr className="table100-head">
              <th>ID</th>
              <th>Nome</th>
              <th>Card HubSoft</th>
              <th>Contrato Assinado</th>
              <th>Comprovante de Residência</th>
              <th>Comprovante de Identidade</th>
              <th>Created At</th>
              <th>Acessar RD</th>
              {(user.role === 'admin' || user.role === 'manager') && (
                <>
                  <th>Solicitar Assinatura</th>
                  <th>Logs</th>
                </>
              )}
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {leadsFiltered.map(lead => {
              return (
                <tr key={lead.id}>
                  <td className="column2">{lead.id}</td>
                  <td className="column1">{lead.name}</td>
                  <td className="column1">
                    {lead.card_id ? (
                      lead.card_id
                    ) : (
                      <FiArrowUpCircle
                        onClick={() => createCardHubSoft(lead?.id)}
                      />
                    )}
                  </td>
                  <td>
                    {lead.document_name ? (
                      <Link
                        style={{
                          textDecoration: 'none',
                          fontWeight: 600,
                          color: '#ff9000',
                        }}
                        target="_blank"
                        to={{
                          pathname: `${process.env.REACT_APP_BUCKET_S3_URL}/${lead.document_name}`,
                        }}
                      >
                        {lead.document_name}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {lead.proof_of_residence_name && (
                      <Link
                        style={{
                          textDecoration: 'none',
                          fontWeight: 600,
                          color: '#ff9000',
                        }}
                        target="_blank"
                        to={{
                          pathname: `${process.env.REACT_APP_BUCKET_S3_URL}/${lead.proof_of_residence_name}`,
                        }}
                      >
                        {lead.proof_of_residence_name}
                      </Link>
                    )}
                    <AvatarInput>
                      <label htmlFor={`proofOfResidence${lead.id}`}>
                        <FiUpload />
                        <input
                          id={`proofOfResidence${lead.id}`}
                          type="file"
                          data-lead_id={lead.id}
                          onChange={handleProofOfResidence}
                        />
                      </label>
                    </AvatarInput>
                  </td>
                  <td>
                    {lead.proof_of_identity_name && (
                      <Link
                        style={{
                          textDecoration: 'none',
                          fontWeight: 600,
                          color: '#ff9000',
                        }}
                        target="_blank"
                        to={{
                          pathname: `${process.env.REACT_APP_BUCKET_S3_URL}/${lead.proof_of_identity_name}`,
                        }}
                      >
                        {lead.proof_of_identity_name}
                      </Link>
                    )}
                    <AvatarInput>
                      <label htmlFor={`proofOfIdentity${lead.id}`}>
                        <FiUpload />
                        <input
                          id={`proofOfIdentity${lead.id}`}
                          type="file"
                          data-lead_id={lead.id}
                          onChange={handleProofOfIdentity}
                        />
                      </label>
                    </AvatarInput>
                  </td>
                  <td className="column2">
                    {moment(lead.created_at).format('DD/MM/YYYY HH:mm:SS')}
                  </td>
                  <td>
                    <Link
                      style={{
                        textDecoration: 'none',
                        fontWeight: 600,
                        color: '#ff9000',
                      }}
                      target="_blank"
                      to={{
                        pathname: `${process.env.REACT_APP_RD_URL}/deals/${lead.lead_id}`,
                      }}
                    >
                      <FiLink />
                    </Link>
                  </td>
                  {(user.role === 'admin' || user.role === 'manager') && (
                    <>
                      <td>
                        <FiArrowUpCircle
                          onClick={() => retryDocument(lead?.id)}
                        />
                      </td>
                      <td>
                        <Link
                          style={{
                            textDecoration: 'none',
                            fontWeight: 600,
                            color: '#ff9000',
                          }}
                          target="_blank"
                          to={{
                            pathname: `lead/${lead.lead_id}/logs`,
                          }}
                        >
                          <FiBook />
                        </Link>
                      </td>
                    </>
                  )}
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

export default Leads;
