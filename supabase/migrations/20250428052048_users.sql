-- CREATE TABLE public.users (
--                               id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--                               email VARCHAR UNIQUE NOT NULL,
--                               password VARCHAR NULL,
--                               created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('JST'::text, now()) NOT NULL,
--                               updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('JST'::text, now()) NOT NULL,
--                               first_name VARCHAR NULL,
--                               last_name VARCHAR NULL,
--                               email_verified_at TIMESTAMP WITH TIME ZONE NULL,
--                               is_active BOOLEAN DEFAULT true NOT NULL,
--                               last_login_at TIMESTAMP WITH TIME ZONE NULL,
--                               role VARCHAR NULL,
--                               auth_id UUID UNIQUE NOT NULL REFERENCES auth.users(id)
-- );
CREATE TABLE public.users (
                              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                              email VARCHAR UNIQUE NOT NULL,
                              password VARCHAR NULL,
                              created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('JST'::text, now()) NOT NULL,
                              updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('JST'::text, now()) NOT NULL
);
-- updated_atカラムを自動更新するためのトリガー関数
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- usersテーブルのupdated_atカラムが更新されるたびにトリガー関数を実行
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();