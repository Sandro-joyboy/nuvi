-- Migration: Criação da tabela de waitlist, índices, RLS e RPC atómica

-- 1. Criação da tabela waitlist
-- Nota: "position" usa aspas porque é palavra reservada em PostgreSQL
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  "position" bigint generated always as identity unique,
  email text not null unique,
  source text default null,
  email_sent boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. Índices para performance
create index if not exists idx_waitlist_email on public.waitlist (email);
create index if not exists idx_waitlist_created_at on public.waitlist (created_at desc);

-- 3. Habilitação de RLS (Row Level Security)
alter table public.waitlist enable row level security;

-- Bloqueia SELECT público para anónimos (anon não consegue ler a tabela)
-- Apenas utilizadores autenticados ou service_role podem ler diretamente
create policy "Admins e service_role podem consultar a waitlist"
  on public.waitlist
  for select
  to authenticated
  using (true);

-- 4. Função RPC atómica: join_waitlist
-- Executada com SECURITY DEFINER para permitir a inserção e verificação segura
create or replace function public.join_waitlist(
  email_input text,
  source_input text default null
)
returns table (
  "position" bigint,
  already_registered boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_email text;
  existing_pos bigint;
  new_pos bigint;
begin
  clean_email := lower(trim(email_input));

  if clean_email is null or clean_email = '' or clean_email not like '%@%.%' then
    raise exception 'Endereço de e-mail inválido';
  end if;

  -- 1. Verifica se já está registado
  select w."position" into existing_pos
  from public.waitlist w
  where w.email = clean_email;

  if existing_pos is not null then
    return query select existing_pos, true;
    return;
  end if;

  -- 2. Regista novo inscrito de forma sequencial
  insert into public.waitlist (email, source)
  values (clean_email, nullif(trim(source_input), ''))
  returning waitlist."position" into new_pos;

  return query select new_pos, false;
end;
$$;

-- Permite acesso à função para utilizadores anónimos e autenticados
revoke all on function public.join_waitlist(text, text) from public;
grant execute on function public.join_waitlist(text, text) to anon, authenticated, service_role;

-- 5. Função para marcar email como enviado
create or replace function public.mark_email_sent(email_input text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.waitlist
  set email_sent = true
  where email = lower(trim(email_input));
end;
$$;

grant execute on function public.mark_email_sent(text) to anon, authenticated, service_role;
