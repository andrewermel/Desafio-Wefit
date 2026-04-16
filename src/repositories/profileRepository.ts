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

export const updateProfile = async (
  id: number,
  updates: Partial<Profile>
): Promise<number> => {
  // Build dynamic SET clause
  const setClause = Object.keys(updates)
    .map(key => `${key} = ?`)
    .join(', ');

  const values = [...Object.values(updates), id];

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
