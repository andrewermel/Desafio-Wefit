import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../database/connection';
import { Profile, ProfileRow } from '../models/Profile';

export const createProfile = async (
  profile: Profile
): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO profiles
      (type, cnpj, cpf, name, phone, telephone, email, cep, street, number, complement, city, neighborhood, state, accepted_terms)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      profile.type,
      profile.cnpj || null,
      profile.cpf,
      profile.name,
      profile.phone,
      profile.telephone || null,
      profile.email,
      profile.cep,
      profile.street,
      profile.number,
      profile.complement || null,
      profile.city,
      profile.neighborhood,
      profile.state,
      profile.acceptedTerms ? 1 : 0,
    ]
  );

  return result.insertId;
};

export const findByEmail = async (
  email: string
): Promise<ProfileRow | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM profiles WHERE email = ? LIMIT 1',
    [email]
  );

  return rows.length > 0 ? (rows[0] as ProfileRow) : null;
};

export const findByCpf = async (
  cpf: string
): Promise<ProfileRow | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM profiles WHERE cpf = ? LIMIT 1',
    [cpf]
  );

  return rows.length > 0 ? (rows[0] as ProfileRow) : null;
};

export const getById = async (
  id: number
): Promise<ProfileRow | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM profiles WHERE id = ? LIMIT 1',
    [id]
  );

  return rows.length > 0 ? (rows[0] as ProfileRow) : null;
};

export const getAll = async (): Promise<ProfileRow[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM profiles ORDER BY created_at DESC'
  );

  return rows as ProfileRow[];
};

const ALLOWED_UPDATE_COLUMNS = [
  'name',
  'email',
  'phone',
  'telephone',
  'street',
  'number',
  'complement',
  'city',
  'neighborhood',
  'state',
  'cep',
];

export const updateProfile = async (
  id: number,
  updates: Partial<Profile>
): Promise<number> => {
  const safeEntries = Object.entries(updates).filter(
    ([key]) => ALLOWED_UPDATE_COLUMNS.includes(key)
  );

  if (safeEntries.length === 0) {
    return 0;
  }

  const setClause = safeEntries
    .map(([key]) => `${key} = ?`)
    .join(', ');

  const values = [...safeEntries.map(([, v]) => v), id];

  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE profiles SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    values
  );

  return result.affectedRows;
};

export const deleteProfile = async (
  id: number
): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM profiles WHERE id = ?',
    [id]
  );

  return result.affectedRows;
};
