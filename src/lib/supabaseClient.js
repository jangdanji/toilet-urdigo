import { createClient } from '@supabase/supabase-js';

// Vite에서는 환경 변수 앞에 VITE_ 접두사가 있어야 브라우저에 노출됩니다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase 환경 변수가 없습니다. .env 파일에서 변수명 앞에 VITE_를 붙여주세요.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
