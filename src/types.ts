export enum AuthKeys {
  username = 'username',
  password = 'password',
  passwordCheck = 'passwordCheck',
  first_name = 'first_name',
  last_name = 'last_name',
  email = 'email',
}

export interface SignUpResult extends User {
  auth_key: string
}

export type Maybe<T> = T | null;

export interface AuthField {
  text: string,
  maxLength: number
  value: string,
  required?: boolean,
  // eslint-disable-next-line no-unused-vars
  validate?: (value: string) => void
}
export interface FetchDataParams {
  url: string,
  data: Maybe<object>,
  method: 'GET' | 'POST'
}

export interface User {
  [AuthKeys.username]: string,
  [AuthKeys.password]: string,
  [AuthKeys.passwordCheck]?: string,
  [AuthKeys.first_name]?: string,
  [AuthKeys.last_name]?: string,
  [AuthKeys.email]?: string
}

interface ListResult {
  count: number,
  next: Maybe<string>,
  previous: Maybe<string>,
}

export interface SuppliersResult extends ListResult {
  results: Supplier[]
}

export interface QuotesResult extends ListResult {
  results: Quote[]
}

export interface Supplier {
  id: number,
  name: string,
  description: Maybe<string>
}

export interface Quote {
  id: number,
  title: string,
  created: string,
  supplier_id: string
}

export interface PaginationLinks {
  previous: Maybe<string>,
  next: Maybe<string>
}

export enum RouteNames {
  ROOT = 'opply',
  NAVIGATION = 'nagivation',
  LOGIN = 'login',
  REGISTER = 'register',
  QUOTES = 'quotes',
  SUPPLIERS = 'suppliers',
  SUPPLIER = 'supplier'
}

