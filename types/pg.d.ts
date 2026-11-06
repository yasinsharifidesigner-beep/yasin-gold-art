declare module 'pg' {
  export class Pool {
    constructor(config: { connectionString?: string; max?: number; ssl?: false | { rejectUnauthorized: boolean } });
    query(text: string, values?: unknown[]): Promise<{ rows: Record<string, any>[]; rowCount: number | null }>;
    connect(): Promise<PoolClient>;
  }

  export class Client {
    constructor(config: { connectionString?: string; ssl?: false | { rejectUnauthorized: boolean } });
    connect(): Promise<void>;
    query(text: string, values?: unknown[]): Promise<{ rows: Record<string, any>[]; rowCount: number | null }>;
    end(): Promise<void>;
  }

  export interface PoolClient {
    query(text: string, values?: unknown[]): Promise<{ rows: Record<string, any>[]; rowCount: number | null }>;
    release(): void;
  }
}
