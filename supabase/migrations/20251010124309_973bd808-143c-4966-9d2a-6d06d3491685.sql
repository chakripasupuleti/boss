-- Disable RLS on all tables for testing
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_progress DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;

DROP POLICY IF EXISTS "Users can view own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can insert own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;

DROP POLICY IF EXISTS "Users can view own practice sessions" ON public.practice_sessions;
DROP POLICY IF EXISTS "Users can insert own practice sessions" ON public.practice_sessions;
DROP POLICY IF EXISTS "Users can update own practice sessions" ON public.practice_sessions;

DROP POLICY IF EXISTS "Users can view own question attempts" ON public.question_attempts;
DROP POLICY IF EXISTS "Users can insert own question attempts" ON public.question_attempts;

DROP POLICY IF EXISTS "Users can view own achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON public.achievements;

DROP POLICY IF EXISTS "Users can view own topic progress" ON public.topic_progress;
DROP POLICY IF EXISTS "Users can insert own topic progress" ON public.topic_progress;
DROP POLICY IF EXISTS "Users can update own topic progress" ON public.topic_progress;