import request from 'supertest';
import { app } from '../../index';
import pool from '../../database/connection';

const req = request(app as any);

describe('POST /cadastro - Fase 5 Integration Tests', () => {
  beforeAll(async () => {
    await pool.query('DELETE FROM profiles');
  });

  afterAll(async () => {
    await pool.query('DELETE FROM profiles');
    await pool.end();
  });

  it('should create pessoa fisica and return 201', async () => {
    const res = await req.post('/cadastro').send({
      type: 'fisica',
      cpf: '547.605.070-19',
      name: 'Maria Silva',
      phone: '(21) 98765-4321',
      email: 'maria.silva.test@example.com',
      confirmEmail: 'maria.silva.test@example.com',
      cep: '20040020',
      street: 'Rua da Assembléia',
      number: '10',
      city: 'Rio de Janeiro',
      neighborhood: 'Centro',
      state: 'RJ',
      acceptedTerms: true,
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  it('should create pessoa juridica and return 201', async () => {
    const res = await req.post('/cadastro').send({
      type: 'juridica',
      cnpj: '05.200.610/0001-52',
      cpf: '183.341.288-51',
      name: 'Tech Solutions LTDA',
      phone: '(11) 3333-5555',
      email: 'tech.solutions.test@example.com',
      confirmEmail: 'tech.solutions.test@example.com',
      cep: '01310100',
      street: 'Avenida Paulista',
      number: '1000',
      city: 'São Paulo',
      neighborhood: 'Bela Vista',
      state: 'SP',
      acceptedTerms: true,
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  it('should reject invalid CPF with 400', async () => {
    const res = await req.post('/cadastro').send({
      type: 'fisica',
      cpf: '00000000000',
      name: 'Invalid CPF',
      phone: '(11) 99999-9999',
      email: 'inv.cpf@example.com',
      confirmEmail: 'inv.cpf@example.com',
      cep: '01452001',
      street: 'Rua X',
      number: '1',
      city: 'São Paulo',
      neighborhood: 'Centro',
      state: 'SP',
      acceptedTerms: true,
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('invalid cpf');
  });

  it('should reject invalid CNPJ with 400', async () => {
    const res = await req.post('/cadastro').send({
      type: 'juridica',
      cnpj: '11111111111111',
      cpf: '111.444.777-35',
      name: 'Invalid CNPJ',
      phone: '(11) 99999-9999',
      email: 'inv.cnpj@example.com',
      confirmEmail: 'inv.cnpj@example.com',
      cep: '01452001',
      street: 'Rua X',
      number: '1',
      city: 'São Paulo',
      neighborhood: 'Centro',
      state: 'SP',
      acceptedTerms: true,
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('invalid cnpj');
  });

  it('should reject empty name with 400', async () => {
    const res = await req.post('/cadastro').send({
      type: 'fisica',
      cpf: '682.858.347-78',
      name: '',
      phone: '(11) 99999-9999',
      email: 'empty.name@example.com',
      confirmEmail: 'empty.name@example.com',
      cep: '01452001',
      street: 'Rua X',
      number: '1',
      city: 'São Paulo',
      neighborhood: 'Centro',
      state: 'SP',
      acceptedTerms: true,
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('name is required');
  });

  it('should reject duplicate email with 409', async () => {
    const email = `dup.${Date.now()}@example.com`;

    await req.post('/cadastro').send({
      type: 'fisica',
      cpf: '591.525.925-10',
      name: 'First Reg',
      phone: '(11) 99999-9999',
      email,
      confirmEmail: email,
      cep: '01452001',
      street: 'Rua X',
      number: '1',
      city: 'São Paulo',
      neighborhood: 'Centro',
      state: 'SP',
      acceptedTerms: true,
    });

    const res = await req.post('/cadastro').send({
      type: 'fisica',
      cpf: '405.342.436-49',
      name: 'Second Reg',
      phone: '(11) 88888-8888',
      email,
      confirmEmail: email,
      cep: '01452001',
      street: 'Rua Y',
      number: '2',
      city: 'São Paulo',
      neighborhood: 'Centro',
      state: 'SP',
      acceptedTerms: true,
    });
    expect(res.status).toBe(409);
  });

  it('should GET /ping and return pong', async () => {
    const res = await req.get('/ping');
    expect(res.status).toBe(200);
    expect(res.text).toBe('pong');
  });
});
