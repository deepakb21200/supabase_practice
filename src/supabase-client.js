import {createClient} from "@supabase/supabase-js"


export let supabase = createClient(
    "https://ijdhrgffiqfyigpgbggd.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqZGhyZ2ZmaXFmeWlncGdiZ2dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NzM3MzIsImV4cCI6MjA4MDI0OTczMn0.97W6qLg1K72TsW39afZ4WgYlo5QJR6snGUC8We-ZzL4"
)